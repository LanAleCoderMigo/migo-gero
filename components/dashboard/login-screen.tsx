"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp"
import { Shield, Lock, Eye, EyeOff, ShieldCheck, KeyRound } from "lucide-react"

type LoginStep = "credentials" | "mfa"

interface LoginScreenProps {
  onAuthenticated: () => void
}

export function LoginScreen({ onAuthenticated }: LoginScreenProps) {
  const [step, setStep] = useState<LoginStep>("credentials")
  const [userId, setUserId] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  function handleCredentialsSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!userId.trim() || !password.trim()) {
      setError("Please enter both User ID and Password.")
      return
    }
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setStep("mfa")
    }, 800)
  }

  function handleMfaSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (otp.length < 6) {
      setError("Please enter the full 6-digit code.")
      return
    }
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      onAuthenticated()
    }, 1000)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="flex w-full max-w-md flex-col items-center gap-8">
        {/* Logo and branding */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
            <Shield className="h-7 w-7 text-primary" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Migo Gero
            </h1>
            <p className="text-sm text-muted-foreground">
              Payment Intelligence Command Center
            </p>
          </div>
        </div>

        {/* Login card */}
        <Card className="w-full border-border/60 bg-card">
          <CardHeader className="text-center">
            <CardTitle className="text-card-foreground flex items-center justify-center gap-2">
              {step === "credentials" ? (
                <>
                  <Lock className="h-4 w-4 text-primary" />
                  Secure Authentication
                </>
              ) : (
                <>
                  <KeyRound className="h-4 w-4 text-primary" />
                  MFA Verification
                </>
              )}
            </CardTitle>
            <CardDescription>
              {step === "credentials"
                ? "Enter your credentials to access the secure dashboard"
                : "Enter the 6-digit code from your authenticator app"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === "credentials" ? (
              <form onSubmit={handleCredentialsSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="user-id" className="text-sm font-medium text-card-foreground">
                    User ID
                  </label>
                  <Input
                    id="user-id"
                    type="text"
                    placeholder="Enter your User ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="bg-secondary border-border text-secondary-foreground placeholder:text-muted-foreground"
                    autoComplete="username"
                    autoFocus
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="password" className="text-sm font-medium text-card-foreground">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-secondary border-border pr-10 text-secondary-foreground placeholder:text-muted-foreground"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-destructive" role="alert">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-2"
                >
                  {isLoading ? "Verifying..." : "Continue to MFA"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleMfaSubmit} className="flex flex-col items-center gap-6">
                <div className="flex items-center gap-2 rounded-lg bg-primary/10 border border-primary/20 px-3 py-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span className="text-xs text-primary font-medium">
                    Code sent to ****@migo.dev
                  </span>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => setOtp(value)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="bg-secondary border-border text-foreground h-12 w-12 text-lg" />
                      <InputOTPSlot index={1} className="bg-secondary border-border text-foreground h-12 w-12 text-lg" />
                      <InputOTPSlot index={2} className="bg-secondary border-border text-foreground h-12 w-12 text-lg" />
                    </InputOTPGroup>
                    <InputOTPSeparator className="text-muted-foreground" />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} className="bg-secondary border-border text-foreground h-12 w-12 text-lg" />
                      <InputOTPSlot index={4} className="bg-secondary border-border text-foreground h-12 w-12 text-lg" />
                      <InputOTPSlot index={5} className="bg-secondary border-border text-foreground h-12 w-12 text-lg" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                {error && (
                  <p className="text-sm text-destructive" role="alert">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={isLoading || otp.length < 6}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isLoading ? "Authenticating..." : "Verify & Access Dashboard"}
                </Button>

                <button
                  type="button"
                  onClick={() => { setStep("credentials"); setOtp(""); setError(""); }}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Back to credentials
                </button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Compliance badges */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary text-xs gap-1">
            <ShieldCheck className="h-3 w-3" />
            PCI DSS Level 1
          </Badge>
          <Badge variant="outline" className="border-border bg-secondary/50 text-muted-foreground text-xs gap-1">
            <Lock className="h-3 w-3" />
            AES-256
          </Badge>
          <Badge variant="outline" className="border-border bg-secondary/50 text-muted-foreground text-xs gap-1">
            <Shield className="h-3 w-3" />
            SSL/TLS Active
          </Badge>
        </div>
      </div>
    </div>
  )
}
