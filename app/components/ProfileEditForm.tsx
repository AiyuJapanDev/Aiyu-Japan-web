import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext'; // ✅ for i18n
import { ALL_COUNTRIES } from '@/lib/shippingUtils';

const ProfileEditForm = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { t } = useApp(); // ✅ translation function
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    address: '',
    address_notes: '',
    country: '',
    postal_code: '',
    city: '',
    state: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        email: profile.email || user?.email || '',
        phone_number: profile.phone_number || '',
        address: profile.address || '',
        address_notes: profile.address_notes || '',
        country: profile.country || '',
        postal_code: profile.postal_code || '',
        city: profile.city || '',
        state: profile.state || ''
      });
    } else if (user) {
      loadProfile();
    }
  }, [profile, user]);

  const loadProfile = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      if (error) throw error;
      if (data) {
        setFormData({
          full_name: data.full_name || '',
          email: data.email || user.email || '',
          phone_number: data.phone_number || '',
          address: data.address || '',
          address_notes: data.address_notes || '',
          country: data.country || '',
          postal_code: data.postal_code || '',
          city: data.city || '',
          state: data.state || ''
        });
      }
    } catch {
      toast({ title: "Error", description: t('errorLoadingProfile'), variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Error", description: t('mustBeLoggedIn'), variant: "destructive" });
      return;
    }

    if (!formData.full_name || !formData.phone_number || !formData.address || !formData.country || !formData.postal_code ||  !formData.email 
    ) {
      toast({ title: "Error", description: t('fillAllRequired'), variant: "destructive" });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          email: formData.email,
          phone_number: formData.phone_number,
          address: formData.address,
          address_notes: formData.address_notes || null,
          country: formData.country,
          postal_code: formData.postal_code,
          city: formData.city,
          state: formData.state,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({ title: "Success", description: t('savingSuccess') });
      await refreshProfile();
    } catch {
      toast({ title: "Error", description: t('savingError'), variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('editProfileInformation')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">{t('fullNameLabel')} *</Label>
              <Input id="full_name" name="full_name" value={formData.full_name} onChange={handleInputChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t('emailLabel')} *</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone_number">{t('phoneNumberLabel')} *</Label>
              <Input id="phone_number" name="phone_number" value={formData.phone_number} onChange={handleInputChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">{t('countryLabel')} *</Label>
              <Select value={formData.country} onValueChange={(v) => setFormData({ ...formData, country: v })}>
                <SelectTrigger>
                  <SelectValue placeholder={t('selectCountryPlaceholder')} />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {ALL_COUNTRIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">{t('stateLabel')} *</Label>
              <Input id="state" name="state" value={formData.state} onChange={handleInputChange} required/>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">{t('cityLabel')} *</Label>
              <Input id="city" name="city" value={formData.city} onChange={handleInputChange}  required/>
            </div>

            <div className="space-y-2">
              <Label htmlFor="postal_code">{t('postalCodeLabel')} *</Label>
              <Input id="postal_code" name="postal_code" value={formData.postal_code} onChange={handleInputChange} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">{t('deliveryAddress')} *</Label>
            <Textarea id="address" name="address" value={formData.address} onChange={handleInputChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address_notes">{t('deliveryNotes')}</Label>
            <Textarea id="address_notes" name="address_notes" value={formData.address_notes} onChange={handleInputChange} />
          </div>

          <Button type="submit" className="w-full" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('saving')}
              </>
            ) : (
              t('saveChanges')
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileEditForm;
