"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, User, UserCircle, ArrowRight, Loader2, AlertCircle } from "lucide-react";

import { authApi } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

import heroBg from "@/assets/hero-bg.jpg";

export default function RegisterPage() {
  const router = useRouter();
  
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Client-side validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      await authApi.register({
        username,
        email,
        password,
        displayName
      });
      
      // Redirect to login after successful registration
      router.push("/login?registered=true");
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden py-12">
      {/* Background Matching Hero Section */}
      <div className="absolute inset-0">
        <Image 
          src={heroBg} 
          alt="Vendly Background" 
          fill 
          className="object-cover opacity-30" 
          sizes="100vw" 
          placeholder="blur" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
           className="mx-auto max-w-md w-full relative"
        >
          {/* Decorative Blur Elements */}
          <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-accent/20 blur-3xl" />
          
          <Card className="relative border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl glow-card">
            <CardHeader className="space-y-3 text-center pb-6 pt-8">
              <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/30 shadow-inner">
                <UserCircle className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-3xl font-display font-bold tracking-tight">
                Join <span className="text-gradient">Vendly</span>
              </CardTitle>
              <CardDescription className="text-base">
                Create an account to start shopping and trading
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive" className="bg-destructive/10 text-destructive border-none">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2.5">
                  <Label htmlFor="displayName">Full Name</Label>
                  <div className="relative group">
                    <User className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input
                      id="displayName"
                      type="text"
                      placeholder="John Doe"
                      className="pl-11 h-11 bg-background/50 border-border/50 focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-base"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative group">
                    <UserCircle className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="johndoe123"
                      className="pl-11 h-11 bg-background/50 border-border/50 focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-base"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className="pl-11 h-11 bg-background/50 border-border/50 focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-base"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div className="space-y-2.5">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-11 h-11 bg-background/50 border-border/50 focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-base"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="pl-11 h-11 bg-background/50 border-border/50 focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-base"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-semibold transition-all shadow-lg hover:shadow-primary/25 bg-primary hover:bg-primary/90 mt-4 flex items-center justify-center group"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col border-t border-border/30 pt-6 pb-8">
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-primary hover:underline hover:text-primary transition-all">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
