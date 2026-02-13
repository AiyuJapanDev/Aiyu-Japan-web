import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/useAuth";
import {
  useNavigate,
  useSearchParams,
  Link,
  useLocation,
} from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, Mail, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { StatementSync } from "node:sqlite";
import { useApp } from "@/contexts/AppContext";
import { ALL_COUNTRIES } from "@/lib/shippingUtils";

const Auth = () => {
  const { user, signUp, signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(
    searchParams.get("mode") === "signup" ? false : true
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [signUpStep, setSignUpStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    addressNotes: "",
    country: "",
    postalCode: "",
    city: "",
    state: "",
    tax_vat_Id: "",
  });
  const { t } = useApp();

  // Check if user is already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Check for verification success
  useEffect(() => {
    const verified = searchParams.get("verified");
    if (verified === "true") {
      navigate("/email-verification");
    }
  }, [searchParams, navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let value = e.target.value;
    
    if (e.target.name === 'tax_vat_Id') {
      value = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    }
    
    if (e.target.name === 'phoneNumber') {
      value = value.replace(/[^0-9+]/g, '');
    }
    
    setFormData({ ...formData, [e.target.name]: value });
  };

  const validateStep1 = () => {
    if (!formData.email || !formData.password || !formData.fullName || !formData.lastName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return false;
    }
    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.phoneNumber || formData.phoneNumber.trim() === '') {
      toast({
        title: "Error",
        description: t("phoneNumberRequired"),
        variant: "destructive",
      });
      return false;
    }
    
    const phoneDigits = formData.phoneNumber.replace(/[^0-9]/g, '');
    
    if (phoneDigits.length < 9) {
      toast({
        title: "Error",
        description: t("phoneNumberTooShort"),
        variant: "destructive",
      });
      return false;
    }
    
    if (phoneDigits.length > 14) {
      toast({
        title: "Error",
        description: t("phoneNumberTooLong"),
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const validateStep3 = () => {
    if (
      !formData.address ||
      !formData.country ||
      !formData.postalCode ||
      !formData.city ||
      !formData.state
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required address fields",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (signUpStep === 1 && validateStep1()) {
      setSignUpStep(2);
    } else if (signUpStep === 2 && validateStep2()) {
      setSignUpStep(3);
    }
  };

  const handlePrevStep = () => {
    setSignUpStep(signUpStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (isLogin) {
      const { error } = await signIn(formData.email, formData.password);
      if (!error) {
        navigate("/dashboard");
      }
    } else {
      if (signUpStep !== 3) {
        setIsLoading(false);
        return;
      }
      
      if (!validateStep3()) {
        setIsLoading(false);
        return;
      }

      const fullNameComplete = `${formData.fullName.trim()} ${formData.lastName.trim()}`;

      // Validar email (case-insensitive)
      const { data: existingProfiles } = await supabase
        .from("profiles")
        .select("email")
        .ilike("email", formData.email.trim());

      if (existingProfiles && existingProfiles.length > 0) {
        toast({
          title: t("emailAlreadyRegistered"),
          description: t("emailAlreadyRegisteredDesc"),
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (formData.tax_vat_Id && formData.tax_vat_Id.trim() !== '') {
        const { data: taxExists, error: rpcError } = await supabase
          .rpc('check_tax_id_exists', { input_tax_id: formData.tax_vat_Id });

        if (rpcError) {
          toast({
            title: "Error de validación",
            description: "No se pudo validar la clave fiscal. Intenta nuevamente.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        if (taxExists) {
          toast({
            description: t("taxIdAlreadyInUse"),
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
      }

      const signUpData = {
        phone_number: formData.phoneNumber,
        address: formData.address,
        address_notes: formData.addressNotes,
        country: formData.country,
        postal_code: formData.postalCode,
        city: formData.city,
        state: formData.state,
        tax_vat_Id: formData.tax_vat_Id || null,
      };

      const { error } = await signUp(
        formData.email,
        formData.password,
        fullNameComplete,
        signUpData
      );

      if (error) {
        let errorTitle = "Sign up failed";
        let errorDescription = error.message || "An error occurred during signup.";

        if (
          error.message?.includes("already registered") ||
          error.message?.includes("User already registered")
        ) {
          errorTitle = t("emailAlreadyRegistered");
          errorDescription = t("emailAlreadyRegisteredDesc");
        } else if (
          error.message?.includes("Database error saving new user")
        ) {
          errorTitle = "Tax/VAT ID already in use";
          errorDescription = t("taxIdAlreadyInUse");
        } else if (
          error.message?.includes("duplicate key value") && 
          (error.message?.includes("tax_vat") || error.message?.includes("profiles_tax_vat_id_unique"))
        ) {
          errorTitle = "Tax ID already in use";
          errorDescription = t("taxIdAlreadyInUse");
        } else if (
          error.message?.includes("duplicate key value") && 
          error.message?.includes("email")
        ) {
          errorTitle = t("emailAlreadyRegistered");
          errorDescription = t("emailAlreadyInUse");
        } else if (
          error.message?.includes("duplicate key value") && 
          error.message?.includes("phone")
        ) {
          errorTitle = "Phone already in use";
          errorDescription = t("phoneAlreadyInUse");
        }

        toast({
          title: errorTitle,
          description: errorDescription,
          variant: "destructive",
        });
      } else {
        setEmailSent(true);
      }
    }

    setIsLoading(false);
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-[url(tile_background.png)] bg-repeat flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border-primary/20 shadow-xl">
          <CardContent className="p-12 text-center">
            <div className="mb-6">
              <Mail className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Check your email
              </h2>
              <p className="text-muted-foreground mb-8">
                We've sent a verification email to{" "}
                <strong>{formData.email}</strong>. Please check your inbox and
                click the verification link to activate your account.
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Didn't receive the email? Check your spam folder.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setEmailSent(false);
                  setSignUpStep(1);
                }}
                className="w-full"
              >
                Back to Sign Up
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url(tile_background.png)] bg-repeat animate-fade-in flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border-primary/20 shadow-xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img
              src="/aiyu_logo_small.png"
              alt="Capybara Logo"
              className="h-16 sm:h-16"
            />

            <span className="font-paytone text-5xl text-[#3b434d] ">
              Aiyu Japan
            </span>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            {isLogin ? t("signIn") : t("createYourAccount")}
          </CardTitle>
          {!isLogin && (
            <div className="flex items-center justify-center mt-4 space-x-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  signUpStep >= 1
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {signUpStep > 1 ? <Check className="w-4 h-4" /> : "1"}
              </div>
              <div
                className={`w-12 h-1 ${
                  signUpStep >= 2 ? "bg-primary" : "bg-muted"
                }`}
              />
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  signUpStep >= 2
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {signUpStep > 2 ? <Check className="w-4 h-4" /> : "2"}
              </div>
              <div
                className={`w-12 h-1 ${
                  signUpStep >= 3 ? "bg-primary" : "bg-muted"
                }`}
              />
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  signUpStep >= 3
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                3
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <form 
            onSubmit={handleSubmit} 
            className="space-y-4"
            onKeyDown={(e) => {
              if (!isLogin && signUpStep < 3 && e.key === 'Enter') {
                e.preventDefault();
                handleNextStep();
              }
            }}
          >
            {isLogin ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="rounded-lg"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{t("password")}</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      className="rounded-lg pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? t("signingIn") : t("signIn")}
                </Button>
              </>
            ) : (
              <>
                {signUpStep === 1 && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">{t("fullName")} *</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          type="text"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="rounded-lg"
                          placeholder={t("firstNamePlaceholder")}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">{t("lastName")} *</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          type="text"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="rounded-lg"
                          placeholder={t("lastNamePlaceholder")}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">{t("email")} *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="rounded-lg"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">{t("password")} *</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleInputChange}
                          className="rounded-lg pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        {t("confirmPassword")} *
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="rounded-lg pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={handleNextStep}
                      className="w-full"
                    >
                      {t("next")} <ArrowRight className="h-4 w-4" />
                    </Button>
                  </>
                )}

                {signUpStep === 2 && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">{t("phoneNumber")} *</Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder={t("phoneNumberPlaceholder")}
                        className="rounded-lg"
                        required
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrevStep}
                        className="flex-1"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" /> {t("back")}
                      </Button>
                      <Button
                        type="button"
                        onClick={handleNextStep}
                        className="flex-1"
                      >
                        {t("next")} <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}

                {signUpStep === 3 && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="tax_vat_Id">
                        {t("taxVatIdLabel")}{" "}
                        <span className="text-muted-foreground">({t("optional")})</span>
                      </Label>
                      <Input
                        id="tax_vat_Id"
                        name="tax_vat_Id"
                        type="text"
                        value={formData.tax_vat_Id}
                        onChange={handleInputChange}
                        placeholder={t("taxVatIdPlaceholder")}
                        className="rounded-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">{t("country")} *</Label>
                      <Select
                        value={formData.country}
                        onValueChange={(value) =>
                          setFormData({ ...formData, country: value })
                        }
                      >
                        <SelectTrigger className="rounded-lg">
                          <SelectValue
                            placeholder={t("selectCountryPlaceholder")}
                          />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {ALL_COUNTRIES.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">{t("stateLabel")} *</Label>
                      <Input
                        id="state"
                        name="state"
                        type="text"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder={t("statePlaceholder")}
                        className="rounded-lg"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">{t("cityLabel")} *</Label>
                      <Input
                        id="city"
                        name="city"
                        type="text"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder={t("cityPlaceholder")}
                        className="rounded-lg"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="postalCode">
                        {t("postalCodeLabel")} *
                      </Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        type="text"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        placeholder="100-0001"
                        className="rounded-lg"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">{t("deliveryAddress")} *</Label>
                      <Textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder={t("deliveryAddressPlaceholder")}
                        className="rounded-lg min-h-[80px]"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="addressNotes">{t("deliveryNotes")}</Label>
                      <Textarea
                        id="addressNotes"
                        name="addressNotes"
                        value={formData.addressNotes}
                        onChange={handleInputChange}
                        placeholder={t("deliveryNotesPlaceholder")}
                        className="rounded-lg min-h-[60px]"
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrevStep}
                        className="flex-1"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" /> {t("back")}
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1"
                        disabled={isLoading}
                      >
                        {isLoading ? t("creatingAccount") : t("completeSignUp")}
                      </Button>
                    </div>
                  </>
                )}
              </>
            )}
          </form>

          <div className="text-center space-y-2">
            {isLogin && (
              <Link to="/forgot-password">
                <p className="text-sm text-primary hover:text-primary-hover cursor-pointer">
                  {t("forgotPasswordQuestion")}
                </p>
              </Link>
            )}
            <p className="text-sm text-muted-foreground">
              {isLogin
                ? t("dontHaveAccountQuestion")
                : t("alreadyHaveAccountQuestion")}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setSignUpStep(1);
                }}
                className="text-primary hover:text-primary-hover font-medium"
              >
                {isLogin ? t("signUp") : t("signIn")}
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
