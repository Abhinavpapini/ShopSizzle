import { SignIn, SignUp } from '@clerk/clerk-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

const Auth = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                {isSignIn ? 'Welcome Back' : 'Create Account'}
              </CardTitle>
              <CardDescription>
                {isSignIn 
                  ? 'Sign in to your ShopSizzle account' 
                  : 'Join ShopSizzle to start shopping'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center mb-4">
                <div className="flex space-x-2 bg-muted rounded-lg p-1">
                  <Button
                    variant={isSignIn ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setIsSignIn(true)}
                  >
                    Sign In
                  </Button>
                  <Button
                    variant={!isSignIn ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setIsSignIn(false)}
                  >
                    Sign Up
                  </Button>
                </div>
              </div>

              <div className="flex justify-center">
                {isSignIn ? (
                  <SignIn 
                    appearance={{
                      elements: {
                        formButtonPrimary: 'bg-primary hover:bg-primary/90 text-primary-foreground',
                        card: 'shadow-none border-0',
                        headerTitle: 'hidden',
                        headerSubtitle: 'hidden',
                        socialButtonsBlockButton: 'border-input',
                        dividerLine: 'bg-border',
                        dividerText: 'text-muted-foreground',
                      }
                    }}
                    redirectUrl="/"
                  />
                ) : (
                  <SignUp 
                    appearance={{
                      elements: {
                        formButtonPrimary: 'bg-primary hover:bg-primary/90 text-primary-foreground',
                        card: 'shadow-none border-0',
                        headerTitle: 'hidden',
                        headerSubtitle: 'hidden',
                        socialButtonsBlockButton: 'border-input',
                        dividerLine: 'bg-border',
                        dividerText: 'text-muted-foreground',
                      }
                    }}
                    redirectUrl="/"
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
