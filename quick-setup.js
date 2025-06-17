import { Pool } from '@neondatabase/serverless';
import bcrypt from 'bcrypt';

async function quickSetup() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    // Create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        balance DECIMAL(10,2) DEFAULT 0.00,
        wallet_balance DECIMAL(10,2) DEFAULT 500.00,
        bonus_balance DECIMAL(10,2) DEFAULT 100.00,
        vip_level INTEGER DEFAULT 1,
        kyc_status VARCHAR(50) DEFAULT 'pending',
        referral_code VARCHAR(255),
        referred_by VARCHAR(255),
        total_deposit DECIMAL(10,2) DEFAULT 0.00,
        total_withdraw DECIMAL(10,2) DEFAULT 0.00,
        total_bet DECIMAL(10,2) DEFAULT 0.00,
        total_win DECIMAL(10,2) DEFAULT 0.00,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS game_transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        game_type VARCHAR(100),
        bet_amount DECIMAL(10,2),
        win_amount DECIMAL(10,2),
        multiplier DECIMAL(10,4),
        is_win BOOLEAN,
        result_data JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create demo user
    const hashedPassword = await bcrypt.hash('demo123', 10);
    
    await pool.query(`
      INSERT INTO users (
        username, phone, password, email, wallet_balance, 
        bonus_balance, referral_code
      ) VALUES (
        'DemoPlayer', '9876543210', $1, 'demo@91club.com', 
        10814.00, 100.00, 'DEMO123'
      ) ON CONFLICT (phone) DO UPDATE SET
        wallet_balance = 10814.00,
        password = $1;
    `, [hashedPassword]);

    console.log('✅ Database setup complete!');
    console.log('✅ Demo user created: Phone: 9876543210, Password: demo123');
    
  } catch (error) {
    console.error('Setup error:', error);
  } finally {
    await pool.end();
  }
}

quickSetup();