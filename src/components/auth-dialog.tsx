'use client';

import { useState, useContext } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthContext } from '@/context/auth-context';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { XCircle } from 'lucide-react';

export function AuthDialog() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login } = useContext(AuthContext);

  const handleLogin = () => {
    setError(null);
    if (!login(password)) {
      setError('Incorrect password. Please try again.');
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Admin Access Required</CardTitle>
          <CardDescription>
            Please enter the password to access this feature.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              required
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Authentication Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleLogin}>
            Unlock
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
