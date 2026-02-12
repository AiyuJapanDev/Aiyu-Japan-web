import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useAuth } from '@/contexts/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Loader2, User, Edit, Save, X, ChevronDown } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import JapaneseAddress from '@/components/JapaneseAddress';
import { ALL_COUNTRIES } from '@/lib/shippingUtils';

const ProfileView = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { t } = useApp();

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false);

  const [displayData, setDisplayData] = useState({
    user_personal_id: '',
    full_name: '',
    email: '',
    phone_number: '',
    address: '',
    address_notes: '',
    country: '',
    postal_code: '',
    city: '',
    state: '',
    tax_vat_Id: ''
  });

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    address: '',
    address_notes: '',
    country: '',
    postal_code: '',
    city: '',
    state: '',
    tax_vat_Id: ''
  });

  useEffect(() => {
    loadProfile();
  }, [user]);

  useEffect(() => {
    if (profile) {
      const data = {
        user_personal_id: profile.user_personal_id || '',
        full_name: profile.full_name || '',
        email: profile.email || user?.email || '',
        phone_number: profile.phone_number || '',
        address: profile.address || '',
        address_notes: profile.address_notes || '',
        country: profile.country || '',
        postal_code: profile.postal_code || '',
        city: profile.city || '',
        state: profile.state || '',
        tax_vat_Id: profile.tax_vat_Id || ''
      };
      setDisplayData(data);
      setFormData({
        full_name: data.full_name,
        email: data.email,
        phone_number: data.phone_number,
        address: data.address,
        address_notes: data.address_notes,
        country: data.country,
        postal_code: data.postal_code,
        city: data.city,
        state: data.state,
        tax_vat_Id: data.tax_vat_Id
      });
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
        const profileData = {
          user_personal_id: data.user_personal_id || '',
          full_name: data.full_name || '',
          email: data.email || user.email || '',
          phone_number: data.phone_number || '',
          address: data.address || '',
          address_notes: data.address_notes || '',
          country: data.country || '',
          postal_code: data.postal_code || '',
          city: data.city || '',
          state: data.state || '',
          tax_vat_Id: data.tax_vat_Id || ''
        };
        setDisplayData(profileData);
        setFormData({
          full_name: profileData.full_name,
          email: profileData.email,
          phone_number: profileData.phone_number,
          address: profileData.address,
          address_notes: profileData.address_notes,
          country: profileData.country,
          postal_code: profileData.postal_code,
          city: profileData.city,
          state: profileData.state,
          tax_vat_Id: profileData.tax_vat_Id
        });
      }
    } catch (error) {
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

    if (!formData.full_name || !formData.email || !formData.phone_number || !formData.address || !formData.country || !formData.postal_code || !formData.city || !formData.state) {
      toast({ title: "Error", description: t('fillAllRequired'), variant: "destructive" });
      return;
    }

    if (formData.phone_number && formData.phone_number !== displayData.phone_number) {
      const cleanPhone = formData.phone_number.replace(/\D/g, '');
      const phoneVariants = [
        formData.phone_number,
        cleanPhone,
        `+${cleanPhone}`,
        cleanPhone.startsWith('81') ? cleanPhone : `81${cleanPhone}`,
        cleanPhone.startsWith('81') ? cleanPhone.substring(2) : cleanPhone
      ];

      const { data: existingPhones } = await supabase
        .from('profiles')
        .select('phone_number, id')
        .neq('id', user.id);

      if (existingPhones && existingPhones.length > 0) {
        const phoneExists = existingPhones.some(profile => {
          if (!profile.phone_number) return false;
          const existingClean = profile.phone_number.replace(/\D/g, '');
          return phoneVariants.some(variant => {
            const variantClean = variant.replace(/\D/g, '');
            return variantClean === existingClean || 
                   variantClean === existingClean.replace(/^81/, '') ||
                   variantClean.replace(/^81/, '') === existingClean;
          });
        });

        if (phoneExists) {
          toast({
            description: t('phoneAlreadyInUse'),
            variant: "destructive"
          });
          return;
        }
      }
    }

    if (formData.tax_vat_Id && formData.tax_vat_Id.trim() !== '') {
      const cleanTaxId = formData.tax_vat_Id.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      const cleanDisplayTaxId = displayData.tax_vat_Id ? displayData.tax_vat_Id.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() : '';
      
      if (cleanTaxId !== cleanDisplayTaxId) {
        const { data: taxExists, error: rpcError } = await supabase
          .rpc('check_tax_id_exists', { input_tax_id: formData.tax_vat_Id });

        if (rpcError) {
          console.error('Error validating tax ID:', rpcError);
          toast({
            title: "Error de validación",
            description: "No se pudo validar la clave fiscal. Intenta nuevamente.",
            variant: "destructive",
          });
          return;
        }

        if (taxExists) {
          toast({
            description: t('taxIdAlreadyInUse'),
            variant: "destructive"
          });
          return;
        }
      }
    }

    if (formData.email && formData.email.trim() !== '' && formData.email.toLowerCase() !== displayData.email.toLowerCase()) {
      const { data: existingEmails } = await supabase
        .from('profiles')
        .select('email, id')
        .ilike('email', formData.email.trim())
        .neq('id', user.id);

      if (existingEmails && existingEmails.length > 0) {
        toast({
          description: t('emailAlreadyInUse'),
          variant: "destructive"
        });
        return;
      }
    }

    setIsSaving(true);
    try {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      let error;
      if (existingProfile) {
        const { error: updateError } = await supabase
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
            tax_vat_Id: formData.tax_vat_Id || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            full_name: formData.full_name,
            email: formData.email,
            phone_number: formData.phone_number,
            address: formData.address,
            address_notes: formData.address_notes || null,
            country: formData.country,
            postal_code: formData.postal_code,
            city: formData.city,
            state: formData.state,
            tax_vat_Id: formData.tax_vat_Id || null
          });
        error = insertError;
      }

      if (error) throw error;

      const updatedData = {
        user_personal_id: displayData.user_personal_id,
        full_name: formData.full_name,
        email: formData.email,
        phone_number: formData.phone_number,
        address: formData.address,
        address_notes: formData.address_notes,
        country: formData.country,
        postal_code: formData.postal_code,
        city: formData.city,
        state: formData.state,
        tax_vat_Id: formData.tax_vat_Id
      };
      setDisplayData(updatedData);
      setIsEditing(false);
      toast({ title: "Success", description: t('savingSuccess') });
      refreshProfile();
    } catch (error: any) {
      let errorMessage = t('savingError');
      
      // Interceptar errores específicos de constraints
      if (error.message) {
        if (error.message.includes('profiles_email_key') || error.message.includes('duplicate key value') && error.message.includes('email')) {
          errorMessage = t('emailAlreadyInUse');
        } else if (error.message.includes('profiles_phone_number_key') || error.message.includes('duplicate key value') && error.message.includes('phone')) {
          errorMessage = t('phoneAlreadyInUse');
        } else if (error.message.includes('profiles_tax_vat_id_unique') || error.message.includes('duplicate key value') && error.message.includes('tax_vat')) {
          errorMessage = t('taxIdAlreadyInUse');
        }
      }
      
      toast({
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...displayData });
    setIsEditing(false);
  };

  const handleEdit = () => {
    setFormData({ ...displayData });
    setIsEditing(true);
    if (!open) setOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let value = e.target.value;
    
    if (e.target.name === 'tax_vat_Id') {
      value = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    }
    
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Card className="max-w-4xl">
        <Collapsible open={open} onOpenChange={setOpen}>

          {/* Header triggers the collapse */}
          <CollapsibleTrigger asChild>
            <CardHeader
              className="flex flex-row items-center justify-between cursor-pointer hover:bg-muted/40 transition-colors rounded-t-lg select-none"
            >
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5 text-capybara-orange" />
                {t('profileInformation')}
              </CardTitle>

              <ChevronDown className="h-5 w-5 transition-transform duration-200 data-[state=open]:rotate-180" />
            </CardHeader>
          </CollapsibleTrigger>


          <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
            <CardContent>
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {displayData.user_personal_id && (
                    <div className="space-y-2 bg-muted/50 p-4 rounded-lg border">
                      <Label className="text-muted-foreground text-sm">User ID</Label>
                      <p className="font-mono font-semibold text-lg">{displayData.user_personal_id}</p>
                    </div>
                  )}

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
                      <Input id="phone_number" name="phone_number" type="tel" value={formData.phone_number} onChange={handleInputChange} required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tax_vat_Id">
                        {t('taxVatIdLabelShort')}{" "}
                        <span className="text-muted-foreground">({t('optional')})</span>
                      </Label>
                      <Input
                        id="tax_vat_Id"
                        name="tax_vat_Id"
                        type="text"
                        value={formData.tax_vat_Id}
                        onChange={handleInputChange}
                        placeholder={t('taxVatIdPlaceholder')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">{t('countryLabel')} *</Label>
                      <Select value={formData.country} onValueChange={(value) => setFormData({ ...formData, country: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder={t('selectCountryPlaceholder')} />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {ALL_COUNTRIES.map(country => (
                            <SelectItem key={country} value={country}>{country}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">{t('stateLabel')} *</Label>
                      <Input id="state" name="state" value={formData.state} onChange={handleInputChange} required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">{t('cityLabel')} *</Label>
                      <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required />
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

                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={handleCancel} disabled={isSaving}>
                      <X className="mr-2 h-4 w-4" />
                      {t('cancelButton')}
                    </Button>
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('saving')}
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          {t('saveButton')}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  {displayData.user_personal_id && (
                    <div className="space-y-2 bg-muted/50 p-4 rounded-lg border mb-6">
                      <Label className="text-muted-foreground text-sm">User ID</Label>
                      <p className="font-mono font-semibold text-lg">{displayData.user_personal_id}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-muted-foreground text-sm">{t('fullNameLabel')}</Label>
                      <p className="font-medium mt-1">{displayData.full_name || t('notProvided')}</p>
                    </div>

                    <div>
                      <Label className="text-muted-foreground text-sm">{t('emailLabel')}</Label>
                      <p className="font-medium mt-1">{displayData.email || t('notProvided')}</p>
                    </div>

                    <div>
                      <Label className="text-muted-foreground text-sm">{t('phoneNumberLabel')}</Label>
                      <p className="font-medium mt-1">{displayData.phone_number || t('notProvided')}</p>
                    </div>

                    <div>
                      <Label className="text-muted-foreground text-sm">{t('taxVatIdLabelShort')}</Label>
                      <p className="font-medium mt-1">{displayData.tax_vat_Id || t('notProvided')}</p>
                    </div>

                    <div>
                      <Label className="text-muted-foreground text-sm">{t('countryLabel')}</Label>
                      <p className="font-medium mt-1">{displayData.country || t('notProvided')}</p>
                    </div>

                    <div>
                      <Label className="text-muted-foreground text-sm">{t('stateLabel')}</Label>
                      <p className="font-medium mt-1">{displayData.state || t('notProvided')}</p>
                    </div>

                    <div>
                      <Label className="text-muted-foreground text-sm">{t('cityLabel')}</Label>
                      <p className="font-medium mt-1">{displayData.city || t('notProvided')}</p>
                    </div>

                    <div>
                      <Label className="text-muted-foreground text-sm">{t('postalCodeLabel')}</Label>
                      <p className="font-medium mt-1">{displayData.postal_code || t('notProvided')}</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-muted-foreground text-sm">{t('deliveryAddress')}</Label>
                    <p className="font-medium mt-1 whitespace-pre-wrap">{displayData.address || t('notProvided')}</p>
                  </div>

                  {displayData.address_notes && (
                    <div>
                      <Label className="text-muted-foreground text-sm">{t('deliveryNotes')}</Label>
                      <p className="font-medium mt-1 whitespace-pre-wrap">{displayData.address_notes}</p>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <Button className="w-full" onClick={handleEdit}>
                      <Edit className="mr-2 h-4 w-4" />
                      {t('editProfileButton')}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <JapaneseAddress userId={displayData.user_personal_id} username={displayData.full_name}/>


    </>

  );
};

export default ProfileView;
