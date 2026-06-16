// src/components/users/profile/TwoFactorSection.tsx
'use client';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Loader2, ShieldCheck, KeyRound, X, Eye, EyeOff } from 'lucide-react';
import {
  useGetUserQuery,
  useRequestTwoFactorSetupMutation,
  useConfirmTwoFactorSetupMutation,
  useDisableTwoFactorMutation,
} from '@/redux/user-api';
import { extractApiError } from '@/utils/extract-api-error';

interface TwoFactorSectionProps {
  userId: string;
}

type Mode = 'idle' | 'confirming' | 'disabling';

const TwoFactorSection: React.FC<TwoFactorSectionProps> = ({ userId }) => {
  const { data, isLoading: isLoadingUser } = useGetUserQuery(userId);
  const enabled = data?.data.twoFactorEnabled ?? false;

  const [mode, setMode] = useState<Mode>('idle');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [requestSetup, { isLoading: isRequesting }] =
    useRequestTwoFactorSetupMutation();
  const [confirmSetup, { isLoading: isConfirming }] =
    useConfirmTwoFactorSetupMutation();
  const [disable, { isLoading: isDisabling }] = useDisableTwoFactorMutation();

  const busy = isRequesting || isConfirming || isDisabling;

  const resetFlow = () => {
    setMode('idle');
    setCode('');
    setPassword('');
    setShowPassword(false);
  };

  const handleToggle = async (next: boolean) => {
    if (busy) return;

    if (next) {
      // Turning on: email a setup code, then collect it.
      const toastId = toast.loading('Sending confirmation code…');
      try {
        const res = await requestSetup(userId).unwrap();
        toast.dismiss(toastId);
        toast.success(res.message || 'A confirmation code has been sent');
        setMode('confirming');
      } catch (err) {
        toast.dismiss(toastId);
        toast.error(extractApiError(err).message);
      }
    } else {
      // Turning off: require the password.
      setMode('disabling');
    }
  };

  const handleConfirm = async () => {
    if (!/^\d{6}$/.test(code)) {
      toast.error('Enter the 6-digit code from your email');
      return;
    }
    const toastId = toast.loading('Enabling two-factor authentication…');
    try {
      const res = await confirmSetup({ userId, code }).unwrap();
      toast.dismiss(toastId);
      toast.success(res.message || 'Two-factor authentication enabled');
      resetFlow();
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(extractApiError(err).message);
    }
  };

  const handleDisable = async () => {
    if (!password) {
      toast.error('Your password is required');
      return;
    }
    const toastId = toast.loading('Disabling two-factor authentication…');
    try {
      const res = await disable({ userId, password }).unwrap();
      toast.dismiss(toastId);
      toast.success(res.message || 'Two-factor authentication disabled');
      resetFlow();
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(extractApiError(err).message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center p-4 border-2 border-border rounded-lg bg-card shadow-sm">
        <div className="flex items-start gap-3">
          <ShieldCheck
            className={`h-5 w-5 mt-0.5 ${enabled ? 'text-primary' : 'text-muted-foreground'}`}
          />
          <div>
            <p className="text-sm font-medium text-foreground">Enable 2FA</p>
            <p className="text-xs text-muted-foreground">
              {enabled
                ? 'A code is emailed to you each time you sign in.'
                : 'Secure your account with an emailed sign-in code.'}
            </p>
          </div>
        </div>
        <Switch
          className="data-[state=checked]:bg-primary"
          checked={enabled}
          disabled={isLoadingUser || busy || mode !== 'idle'}
          onCheckedChange={handleToggle}
        />
      </div>

      {/* Confirm setup with the emailed code */}
      {mode === 'confirming' && (
        <div className="p-4 border-2 border-primary/30 rounded-lg bg-primary/5 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">
              Enter the code we emailed you
            </p>
            <button
              type="button"
              onClick={resetFlow}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Cancel"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <Input
            value={code}
            onChange={(e) =>
              setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
            }
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="123456"
            maxLength={6}
            className="h-11 tracking-[0.4em] text-center font-semibold"
            disabled={isConfirming}
          />
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={resetFlow}
              disabled={isConfirming}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={isConfirming || code.length !== 6}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isConfirming ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enabling…
                </>
              ) : (
                'Enable 2FA'
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Disable requires the password */}
      {mode === 'disabling' && (
        <div className="p-4 border-2 border-destructive/30 rounded-lg bg-destructive/5 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">
              Confirm your password to turn off 2FA
            </p>
            <button
              type="button"
              onClick={resetFlow}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Cancel"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="h-11 pl-10 pr-10"
              disabled={isDisabling}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={resetFlow}
              disabled={isDisabling}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDisable}
              disabled={isDisabling || !password}
            >
              {isDisabling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Disabling…
                </>
              ) : (
                'Disable 2FA'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TwoFactorSection;
