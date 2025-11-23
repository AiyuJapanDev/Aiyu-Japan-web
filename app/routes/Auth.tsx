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
  ); //when passing "?mode=signup" query param to url takes users to register form. <Link /> component must use reloadDocument property to refresh the DOM with current UI
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
    phoneNumber: "",
    address: "",
    addressNotes: "",
    country: "",
    postalCode: "",
    city: "",
    state: "",
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateStep1 = () => {
    if (!formData.email || !formData.password || !formData.fullName) {
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
    if (!formData.phoneNumber) {
      toast({
        title: "Error",
        description: "Please enter your phone number",
        variant: "destructive",
      });
      return false;
    }
    const phoneRegex = /^[\d\s+()-]+$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      toast({
        title: "Error",
        description: "Please enter a valid phone number",
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
      // Sign in
      const { error } = await signIn(formData.email, formData.password);
      if (!error) {
        navigate("/dashboard");
      }
    } else {
      // Sign up - validate final step
      if (signUpStep === 3 && !validateStep3()) {
        setIsLoading(false);
        return;
      }

      // Check for existing email/phone in profiles table
      const { data: existingProfiles } = await supabase
        .from("profiles")
        .select("email, phone_number")
        .or(
          `email.eq.${formData.email},phone_number.eq.${formData.phoneNumber}`
        );

      if (existingProfiles && existingProfiles.length > 0) {
        const existingEmail = existingProfiles.find(
          (p) => p.email === formData.email
        );
        const existingPhone = existingProfiles.find(
          (p) => p.phone_number === formData.phoneNumber
        );

        if (existingEmail) {
          toast({
            title: "Email already registered",
            description:
              "This email is already in use. Please sign in or use a different email.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        if (existingPhone) {
          toast({
            title: "Phone number already registered",
            description:
              "This phone number is already in use. Please use a different phone number.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
      }

      // Pass all profile data as user metadata
      const { error } = await signUp(
        formData.email,
        formData.password,
        formData.fullName,
        {
          phone_number: formData.phoneNumber,
          address: formData.address,
          address_notes: formData.addressNotes,
          country: formData.country,
          postal_code: formData.postalCode,
          city: formData.city,
          state: formData.state,
        }
      );

      if (error) {
        // Handle Supabase auth errors
        if (
          error.message?.includes("already registered") ||
          error.message?.includes("User already registered")
        ) {
          toast({
            title: "Email already registered",
            description:
              "This email is already registered. Please sign in instead.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Sign up failed",
            description: error.message || "An error occurred during signup.",
            variant: "destructive",
          });
        }
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
          <form onSubmit={handleSubmit} className="space-y-4">
            {isLogin ? (
              // Login form
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
              // Multi-step signup form
              <>
                {signUpStep === 1 && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="fullName">{t("fullName")} *</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="rounded-lg"
                        required
                      />
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
                      {t("next")} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </>
                )}

                {signUpStep === 2 && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">
                        {t("phoneNumberLabel")} *
                      </Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="+81 90-1234-5678"
                        className="rounded-lg"
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        {t("includeCountryCode")}
                      </p>
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
                        {t("next")} <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}

                {signUpStep === 3 && (
                  <>
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
