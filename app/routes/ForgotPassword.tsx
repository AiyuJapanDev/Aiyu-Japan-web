import React, { useState } from 'react';
import { useAuth } from '@/contexts/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router';
import { ArrowLeft, Mail } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';


const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { t } = useApp();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await resetPassword(email);
    
    if (!error) {
      setEmailSent(true);
    }
    
    setIsLoading(false);
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-[url(tile_background.png)] bg-repeat flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border-blue-200 shadow-xl">
          <CardContent className="p-12 text-center">
            <div className="mb-6">
              <Mail className="w-16 h-16 text-blue-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('checkYourEmail')}
              </h2>
              <p className="text-gray-600 mb-8">
                {t('emailSentTo')} <strong>{email}</strong>
              </p>
              <p className="text-sm text-gray-500 mb-6">
                {t('didntReceive')}
              </p>
              <Link to="/auth">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('backToSignIn')}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url(tile_background.png)] bg-repeat flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border-blue-200 shadow-xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            
              <img src="/aiyu_logo_small.png" alt="Capybara Logo" className="h-16 sm:h-16" />
            
            <span className="font-paytone text-5xl text-[#3b434d] ">Aiyu Japan</span>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {t('forgotPasswordTitle')}
          </CardTitle>
          <p className="text-gray-600 mt-2">
            {t('forgotPasswordSubtitle')}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('emailLabel')}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg border-blue-200 focus:border-blue-300"
                placeholder= {t('emailPlaceholder')}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-300 hover:bg-blue-400 text-white rounded-lg py-2 font-medium"
              disabled={isLoading}
            >
              {isLoading ? t('sending') : t('sendResetLink')}
            </Button>
          </form>
          
          <div className="text-center">
            <Link to="/auth">
              <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('backToSignIn')}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
