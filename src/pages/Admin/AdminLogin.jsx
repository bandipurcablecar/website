import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Mountain, Lock, Mail } from 'lucide-react';

export default function AdminLogin({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (authError) throw authError;
            onLogin(data.user);
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'Failed to login. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="admin-login">
            <div className="login-card">
                <div className="login-header">
                    <div className="login-logo">
                        <Mountain size={40} />
                    </div>
                    <h1>Welcome Back</h1>
                    <p>Sign in to access the admin panel</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {error && <div className="login-error">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <div className="input-with-icon">
                            <Mail size={18} className="input-icon" />
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="form-input"
                                placeholder="admin@bandipurcablecar.com.np"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <div className="input-with-icon">
                            <Lock size={18} className="input-icon" />
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="form-input"
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg login-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Bandipur Cable Car & Tourism Ltd.</p>
                </div>
            </div>

            <style>{`
        .admin-login {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
          padding: var(--spacing-4);
        }
        
        .login-card {
          background-color: var(--color-white);
          border-radius: var(--radius-2xl);
          padding: var(--spacing-10);
          width: 100%;
          max-width: 420px;
          box-shadow: var(--shadow-2xl);
        }
        
        .login-header {
          text-align: center;
          margin-bottom: var(--spacing-8);
        }
        
        .login-logo {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, var(--color-accent), var(--color-accent-light));
          border-radius: var(--radius-xl);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto var(--spacing-4);
          color: var(--color-white);
        }
        
        .login-header h1 {
          font-size: var(--text-2xl);
          margin-bottom: var(--spacing-2);
        }
        
        .login-header p {
          color: var(--color-gray-500);
        }
        
        .login-error {
          background-color: #fee2e2;
          color: #dc2626;
          padding: var(--spacing-3) var(--spacing-4);
          border-radius: var(--radius-lg);
          margin-bottom: var(--spacing-4);
          font-size: var(--text-sm);
        }
        
        .input-with-icon {
          position: relative;
        }
        
        .input-icon {
          position: absolute;
          left: var(--spacing-4);
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-gray-400);
        }
        
        .input-with-icon .form-input {
          padding-left: calc(var(--spacing-4) * 2 + 18px);
        }
        
        .login-btn {
          width: 100%;
          margin-top: var(--spacing-4);
        }
        
        .login-footer {
          text-align: center;
          margin-top: var(--spacing-6);
          padding-top: var(--spacing-6);
          border-top: 1px solid var(--color-gray-100);
          color: var(--color-gray-500);
          font-size: var(--text-sm);
        }
      `}</style>
        </div>
    );
}
