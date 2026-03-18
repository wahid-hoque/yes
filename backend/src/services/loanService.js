import { query, getClient } from '../config/database.js';

class LoanService {
  async getLoanEligibility(userId) {
    const inflowQuery = `
      SELECT COALESCE(SUM(amount), 0) as total_inflow
      FROM (
          SELECT amount FROM external_topups 
          WHERE wallet_id IN (SELECT wallet_id FROM wallets WHERE user_id = $1)
          AND status = 'completed'
          UNION ALL
          SELECT amount FROM transactions 
          WHERE to_wallet_id IN (SELECT wallet_id FROM wallets WHERE user_id = $1)
          AND transaction_type = 'cash_in' 
          AND status = 'completed'
      ) as inflows;
    `;
    const result = await query(inflowQuery, [userId]);
    const totalInflow = parseFloat(result.rows[0].total_inflow);

    let limit = 0;
    if (totalInflow >= 100000) limit = 30000;
    else if (totalInflow >= 50000) limit = 20000;
    else if (totalInflow >= 25000) limit = 10000;
    else if (totalInflow >= 10000) limit = 5000;
    else if (totalInflow >= 2000) limit = 500;

    return { totalInflow, limit };
  }

  async applyForLoan(userId, amount) {
    // Check for existing active loan or pending app
    const existing = await query(
      `SELECT 1 FROM loans WHERE user_id = $1 AND status IN ('active', 'overdue')
       UNION
       SELECT 1 FROM loan_applications WHERE user_id = $1 AND decision_status = 'submitted'`,
      [userId]
    );
    if (existing.rows.length > 0) throw new Error("You already have an active loan or pending request.");

    const { limit } = await this.getLoanEligibility(userId);
    if (amount < 500 || amount > limit) throw new Error("Invalid loan amount.");

    const res = await query(
      `INSERT INTO loan_applications (user_id, requested_amount, interest_rate, term_days, decision_status)
       VALUES ($1, $2, 0.09, 30, 'submitted') RETURNING *`,
      [userId, amount]
    );
    return res.rows[0];
  }

  async repayLoan(userId, loanId) {
    const client = await getClient();
    try {
      await client.query('BEGIN');

      // 1. Get Loan and Wallet details
      const loanRes = await client.query(
        `SELECT * FROM loans WHERE loan_id = $1 AND user_id = $2 AND status != 'repaid'`,
        [loanId, userId]
      );
      if (loanRes.rows.length === 0) throw new Error("Loan not found or already repaid.");
      
      const loan = loanRes.rows[0];
      const totalToPay = parseFloat(loan.principal_amount) * 1.09; // 9% Interest

      const walletRes = await client.query(
        `SELECT wallet_id, balance FROM wallets WHERE user_id = $1 AND wallet_type = 'user' FOR UPDATE`,
        [userId]
      );
      const wallet = walletRes.rows[0];

      if (parseFloat(wallet.balance) < totalToPay) {
        throw new Error("Insufficient balance in wallet to repay loan.");
      }

      // 2. Create Repayment Transaction
      const transRes = await client.query(
        `INSERT INTO transactions (from_wallet_id, to_wallet_id, amount, transaction_type, status, reference)
         VALUES ($1, (SELECT wallet_id FROM wallets WHERE wallet_type = 'system' AND system_purpose = 'loan_collection'), $2, 'loan_repayment', 'completed', $3)
         RETURNING transaction_id`,
        [wallet.wallet_id, totalToPay, `Repay Loan #${loanId}`]
      );

      // 3. Update Wallet Balance
      await client.query(
        `UPDATE wallets SET balance = balance - $1 WHERE wallet_id = $2`,
        [totalToPay, wallet.wallet_id]
      );

      // 4. Close Loan
      await client.query(
        `UPDATE loans SET status = 'repaid', repayment_transaction_id = $1 WHERE loan_id = $2`,
        [transRes.rows[0].transaction_id, loanId]
      );

      await client.query('COMMIT');
      return { success: true, totalPaid: totalToPay };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getLoanData(userId) {
    const active = await query(`SELECT * FROM loans WHERE user_id = $1 AND status IN ('active', 'overdue') LIMIT 1`, [userId]);
    const latestApp = await query(`SELECT * FROM loan_applications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`, [userId]);
    const history = await query(
      `SELECT l.*, t.created_at as repaid_at 
       FROM loans l 
       JOIN transactions t ON l.repayment_transaction_id = t.transaction_id
       WHERE l.user_id = $1 AND l.status = 'repaid' 
       ORDER BY t.created_at DESC`, 
      [userId]
    );
    const eligibility = await this.getLoanEligibility(userId);

    return { activeLoan: active.rows[0], latestApplication: latestApp.rows[0], history: history.rows, ...eligibility };
  }
}

export default new LoanService();
