import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useNavigate } from 'react-router';
import { useAuth } from '@/contexts/useAuth';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProductItem {
  url: string;
  name: string;
  quantity: number;
  notes: string;
}

const CTASection = () => {
  const { t } = useApp();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [items] = useState<ProductItem[]>([{ url: '', name: '', quantity: 1, notes: '' }]);

  const handleClick = () => {
    if (user && !isAdmin) {
      navigate('/user-dashboard?tab=submit');
    } else {
      setIsDialogOpen(true);
    }
  };

  const handleSignIn = () => {
    setIsDialogOpen(false);
    navigate('/auth');
  };

  return (
    <section className="pt-5 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Card className="bg-white/90 backdrop-blur-sm border-capybara-orange/20 shadow-xl">
          <CardContent className="p-12">
            <div className="mb-6 flex justify-center">
              <img src="KapyShoppingBags.png" alt="Kapy" className="w-24" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              {t('ctaTitle')}
            </h2>
            <p className="text-gray-600 mb-8 text-lg">{t('ctaDescription')}</p>

            <div className="flex justify-center">
              <Button
                onClick={handleClick}
                className="flex items-center gap-2 px-6 py-3 rounded-full border border-capybara-orange/20 bg-white/95 shadow-md 
                           transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
              >
                <Plus className="text-capybara-orange h-5 w-5" />
                <span className="text-sm font-medium text-gray-700">
                  {t('makeOrderButton')}
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog for non-logged-in users */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white rounded-2xl shadow-lg p-6"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>{t('requestProductsTitle')}</DialogTitle>
            <DialogDescription>
              {t('requestProductsDescription')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {items.map((item, index) => (
              <div key={index} className="space-y-2 p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <Label>{t('productDetails')}</Label>
                </div>
                <Input
                  placeholder={t('productUrlPlaceholder')}
                  value={item.url}
                  className="md:col-span-2"
                />
              </div>
            ))}

            <Button
              onClick={handleSignIn}
              className="w-full bg-[var(--capybara-orange)] transition-all duration-300 hover:bg-capybara-blue text-white"
            >
              {t('signInToSubmit')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default CTASection;
