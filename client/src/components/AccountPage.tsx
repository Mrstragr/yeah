import { useState } from 'react';

interface AccountPageProps {
  user: any;
  balance: number;
  onClose: () => void;
}

export const AccountPage = ({ user, balance, onClose }: AccountPageProps) => {
  const [activeSection, setActiveSection] = useState('profile');

  const menuItems = [
    { id: 'profile', icon: '👤', title: 'Profile', subtitle: 'Personal information' },
    { id: 'security', icon: '🔒', title: 'Security', subtitle: 'Password & verification' },
    { id: 'notifications', icon: '🔔', title: 'Notifications', subtitle: 'Alerts & messages' },
    { id: 'support', icon: '💬', title: 'Customer Support', subtitle: '24/7 help available' },
    { id: 'about', icon: 'ℹ️', title: 'About', subtitle: 'App version & info' },
    { id: 'logout', icon: '🚪', title: 'Logout', subtitle: 'Sign out of account' }
  ];

  const stats = [
    { label: 'Total Bets', value: '1,247', icon: '🎮' },
    { label: 'Games Won', value: '589', icon: '🏆' },
    { label: 'Win Rate', value: '47.2%', icon: '📊' },
    { label: 'Total Winnings', value: '₹25,430', icon: '💰' }
  ];

  return (
    <div className="account-page">
      <div className="account-header">
        <button onClick={onClose} className="back-btn">←</button>
        <h2>Account</h2>
        <div></div>
      </div>

      <div className="profile-card">
        <div className="profile-avatar">
          <div className="avatar-circle">
            {user?.username?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        </div>
        <div className="profile-info">
          <h3>{user?.username || 'User'}</h3>
          <p>{user?.phone || '+91 98765 43210'}</p>
          <div className="balance-chip">₹{balance.toFixed(2)}</div>
        </div>
        <div className="profile-actions">
          <button className="edit-btn">Edit</button>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {activeSection === 'profile' && (
        <div className="menu-section">
          <h3>Account Settings</h3>
          {menuItems.map(item => (
            <div 
              key={item.id} 
              className="menu-item"
              onClick={() => item.id === 'logout' ? console.log('Logout') : setActiveSection(item.id)}
            >
              <div className="menu-icon">{item.icon}</div>
              <div className="menu-content">
                <div className="menu-title">{item.title}</div>
                <div className="menu-subtitle">{item.subtitle}</div>
              </div>
              <div className="menu-arrow">→</div>
            </div>
          ))}
        </div>
      )}

      {activeSection === 'security' && (
        <div className="security-section">
          <button onClick={() => setActiveSection('profile')} className="section-back">← Back</button>
          <h3>Security Settings</h3>
          
          <div className="security-item">
            <div className="security-info">
              <div className="security-title">Change Password</div>
              <div className="security-subtitle">Update your login password</div>
            </div>
            <button className="security-btn">Change</button>
          </div>

          <div className="security-item">
            <div className="security-info">
              <div className="security-title">Two-Factor Authentication</div>
              <div className="security-subtitle">Add extra security to your account</div>
            </div>
            <div className="toggle-switch">
              <input type="checkbox" id="2fa" />
              <label htmlFor="2fa"></label>
            </div>
          </div>

          <div className="security-item">
            <div className="security-info">
              <div className="security-title">Login Notifications</div>
              <div className="security-subtitle">Get notified of new logins</div>
            </div>
            <div className="toggle-switch">
              <input type="checkbox" id="login-notify" defaultChecked />
              <label htmlFor="login-notify"></label>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'support' && (
        <div className="support-section">
          <button onClick={() => setActiveSection('profile')} className="section-back">← Back</button>
          <h3>Customer Support</h3>
          
          <div className="support-options">
            <div className="support-option">
              <div className="support-icon">💬</div>
              <div className="support-info">
                <div className="support-title">Live Chat</div>
                <div className="support-subtitle">Get instant help</div>
              </div>
              <button className="support-btn">Start Chat</button>
            </div>

            <div className="support-option">
              <div className="support-icon">📧</div>
              <div className="support-info">
                <div className="support-title">Email Support</div>
                <div className="support-subtitle">support@100xwin.com</div>
              </div>
              <button className="support-btn">Send Email</button>
            </div>

            <div className="support-option">
              <div className="support-icon">📞</div>
              <div className="support-info">
                <div className="support-title">Phone Support</div>
                <div className="support-subtitle">+91 1800 123 4567</div>
              </div>
              <button className="support-btn">Call Now</button>
            </div>
          </div>

          <div className="faq-section">
            <h4>Frequently Asked Questions</h4>
            <div className="faq-item">
              <div className="faq-question">How to deposit money?</div>
              <div className="faq-answer">Go to Wallet → Recharge and select your preferred payment method.</div>
            </div>
            <div className="faq-item">
              <div className="faq-question">How long does withdrawal take?</div>
              <div className="faq-answer">Withdrawals are processed within 5-30 minutes during business hours.</div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .account-page {
          background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
          color: white;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .account-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background: rgba(255,255,255,0.05);
        }

        .back-btn, .section-back {
          background: none;
          border: none;
          color: white;
          font-size: 18px;
          cursor: pointer;
        }

        .account-header h2 {
          margin: 0;
          font-size: 20px;
        }

        .profile-card {
          background: rgba(255,255,255,0.05);
          margin: 20px;
          border-radius: 15px;
          padding: 25px;
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .avatar-circle {
          width: 70px;
          height: 70px;
          background: linear-gradient(45deg, #FF6B6B, #4ECDC4);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          font-weight: bold;
          color: white;
        }

        .profile-info {
          flex: 1;
        }

        .profile-info h3 {
          margin: 0 0 5px 0;
          font-size: 20px;
        }

        .profile-info p {
          margin: 0 0 10px 0;
          opacity: 0.8;
          font-size: 14px;
        }

        .balance-chip {
          background: #4CAF50;
          color: white;
          padding: 6px 12px;
          border-radius: 15px;
          font-size: 12px;
          font-weight: bold;
          display: inline-block;
        }

        .edit-btn {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          cursor: pointer;
          font-size: 12px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          padding: 0 20px;
          margin-bottom: 20px;
        }

        .stat-card {
          background: rgba(255,255,255,0.05);
          padding: 20px;
          border-radius: 12px;
          text-align: center;
        }

        .stat-icon {
          font-size: 24px;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 12px;
          opacity: 0.8;
        }

        .menu-section {
          padding: 0 20px;
        }

        .menu-section h3 {
          margin: 0 0 20px 0;
          font-size: 18px;
        }

        .menu-item {
          background: rgba(255,255,255,0.05);
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 15px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .menu-item:hover {
          background: rgba(255,255,255,0.1);
        }

        .menu-icon {
          font-size: 24px;
          width: 50px;
          height: 50px;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .menu-content {
          flex: 1;
        }

        .menu-title {
          font-weight: bold;
          margin-bottom: 4px;
        }

        .menu-subtitle {
          font-size: 12px;
          opacity: 0.7;
        }

        .menu-arrow {
          opacity: 0.5;
        }

        .security-section, .support-section {
          padding: 20px;
        }

        .security-section h3, .support-section h3 {
          margin: 0 0 20px 0;
          font-size: 18px;
        }

        .security-item {
          background: rgba(255,255,255,0.05);
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .security-title {
          font-weight: bold;
          margin-bottom: 4px;
        }

        .security-subtitle {
          font-size: 12px;
          opacity: 0.7;
        }

        .security-btn {
          background: #FF6B6B;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 15px;
          cursor: pointer;
          font-size: 12px;
        }

        .toggle-switch {
          position: relative;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-switch label {
          display: block;
          width: 50px;
          height: 25px;
          background: #666;
          border-radius: 25px;
          cursor: pointer;
          position: relative;
          transition: all 0.3s;
        }

        .toggle-switch label:after {
          content: '';
          position: absolute;
          top: 2px;
          left: 2px;
          width: 21px;
          height: 21px;
          background: white;
          border-radius: 50%;
          transition: all 0.3s;
        }

        .toggle-switch input:checked + label {
          background: #4CAF50;
        }

        .toggle-switch input:checked + label:after {
          left: 27px;
        }

        .support-options {
          margin-bottom: 30px;
        }

        .support-option {
          background: rgba(255,255,255,0.05);
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .support-icon {
          font-size: 24px;
          width: 50px;
          height: 50px;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .support-info {
          flex: 1;
        }

        .support-title {
          font-weight: bold;
          margin-bottom: 4px;
        }

        .support-subtitle {
          font-size: 12px;
          opacity: 0.7;
        }

        .support-btn {
          background: #4CAF50;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 15px;
          cursor: pointer;
          font-size: 12px;
        }

        .faq-section h4 {
          margin: 0 0 15px 0;
          font-size: 16px;
        }

        .faq-item {
          background: rgba(255,255,255,0.05);
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 10px;
        }

        .faq-question {
          font-weight: bold;
          margin-bottom: 8px;
        }

        .faq-answer {
          font-size: 13px;
          opacity: 0.8;
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
};