'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase-client';
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';
import Link from 'next/link';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [changeEmailLoading, setChangeEmailLoading] = useState(false);
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        router.push('/auth/login');
        return;
      }

      setUser(currentUser);
      setNewEmail(currentUser.email || '');
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin">
            <div className="w-12 h-12 border-4 border-black rounded-full"></div>
          </div>
          <p className="text-gray-600 mt-4">Loading settings...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/');
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    setDeleteLoading(true);
    try {
      const response = await fetch('/api/auth/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          uid: user.uid,
          idToken: await user.getIdToken()
        }),
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');

      await auth.signOut();
      router.push('/');
    } catch (err) {
      alert('Erreur: impossible de supprimer le compte');
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleChangeEmail = async () => {
    if (!user || !newEmail || newEmail === user.email) return;
    
    setChangeEmailLoading(true);
    try {
      const response = await fetch('/api/auth/change-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          uid: user.uid,
          newEmail: newEmail,
          idToken: await user.getIdToken()
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert('Erreur: ' + (data.error || 'impossible de modifier l\'email'));
        setChangeEmailLoading(false);
        return;
      }

      alert('Un lien de vérification a été envoyé à votre nouvel email.');
      setShowChangeEmail(false);
      setChangeEmailLoading(false);
    } catch (err: any) {
      alert('Erreur: ' + (err.message || 'impossible de modifier l\'email'));
      setChangeEmailLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!user?.email) return;
    
    setPasswordError(null);

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordError('Tous les champs sont requis');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError('Le nouveau mot de passe doit être différent de l\'ancien');
      return;
    }

    setChangePasswordLoading(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      alert('Password changed successfully!');
      setShowChangePassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setPasswordError(null);
    } catch (err: any) {
      if (err.code === 'auth/wrong-password') {
        setPasswordError('Mot de passe actuel incorrect');
      } else if (err.code === 'auth/weak-password') {
        setPasswordError('Le mot de passe est trop faible');
      } else {
        setPasswordError('Erreur: ' + (err.message || 'impossible de changer le mot de passe'));
      }
    } finally {
      setChangePasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* NAVBAR */}
      <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-8 py-6 flex justify-between items-center">
          <Link href="/dashboard" className="font-semibold text-sm tracking-tight hover:opacity-60 transition-opacity">
            Next.js Auth Template
          </Link>
          
          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-600">
              {user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-black transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="max-w-3xl mx-auto px-8 py-16">
        
        {/* HEADER */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-black mb-3 tracking-tight">
            Account Settings
          </h1>
          <p className="text-gray-600">
            Manage your account and preferences
          </p>
        </div>

        {/* SETTINGS CARDS */}
        <div className="space-y-6">

          {/* Email */}
          <div className="border border-gray-100 rounded-lg p-8">
            <div className="flex items-center justify-between mb-1">
              <div>
                <h3 className="text-lg font-semibold text-black mb-2">Email Address</h3>
                <p className="text-gray-600 text-sm">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  setShowChangeEmail(!showChangeEmail);
                  setNewEmail(user?.email || '');
                }}
                className="bg-black hover:bg-gray-800 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Change
              </button>
            </div>

            {showChangeEmail && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="New email address"
                  className="w-full bg-white text-black px-4 py-3 border border-gray-200 rounded-lg focus:border-black focus:ring-1 focus:ring-black focus:outline-none mb-4 transition-colors"
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleChangeEmail}
                    disabled={changeEmailLoading}
                    className="bg-black hover:bg-gray-800 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {changeEmailLoading ? 'Sending...' : 'Confirm change'}
                  </button>
                  <button
                    onClick={() => setShowChangeEmail(false)}
                    className="border border-gray-200 hover:border-gray-300 text-black px-5 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Password */}
          <div className="border border-gray-100 rounded-lg p-8">
            <div className="flex items-center justify-between mb-1">
              <div>
                <h3 className="text-lg font-semibold text-black mb-2">Password</h3>
                <p className="text-gray-600 text-sm">Change your password</p>
              </div>
              <button
                onClick={() => {
                  setShowChangePassword(!showChangePassword);
                  setPasswordError(null);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmNewPassword('');
                }}
                className="bg-black hover:bg-gray-800 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Change
              </button>
            </div>

            {showChangePassword && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                {passwordError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
                    {passwordError}
                  </div>
                )}
                
                <div className="space-y-3 mb-4">
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Current password"
                    className="w-full bg-white text-black px-4 py-3 border border-gray-200 rounded-lg focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-colors"
                  />
                  
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password (min 8 characters)"
                    className="w-full bg-white text-black px-4 py-3 border border-gray-200 rounded-lg focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-colors"
                  />
                  
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full bg-white text-black px-4 py-3 border border-gray-200 rounded-lg focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-colors"
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleResetPassword}
                    disabled={changePasswordLoading}
                    className="bg-black hover:bg-gray-800 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {changePasswordLoading ? 'Changing...' : 'Update password'}
                  </button>
                  <button
                    onClick={() => {
                      setShowChangePassword(false);
                      setPasswordError(null);
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmNewPassword('');
                    }}
                    className="border border-gray-200 hover:border-gray-300 text-black px-5 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Delete Account */}
          <div className="border border-red-200 bg-red-50 rounded-lg p-8">
            <div className="flex items-center justify-between mb-1">
              <div>
                <h3 className="text-lg font-semibold text-black mb-2">Delete Account</h3>
                <p className="text-gray-600 text-sm">Permanently delete your account and data</p>
              </div>
              <button
                onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Delete
              </button>
            </div>

            {showDeleteConfirm && (
              <div className="mt-6 pt-6 border-t border-red-200">
                <div className="bg-white border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-red-600 text-sm font-medium">
                    This action cannot be undone. All your data will be permanently deleted.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteLoading}
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {deleteLoading ? 'Deleting...' : 'Yes, delete my account'}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="border border-gray-200 hover:border-gray-300 text-black px-5 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
