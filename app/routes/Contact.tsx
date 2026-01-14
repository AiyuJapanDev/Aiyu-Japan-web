import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/contexts/AppContext";
import { Instagram, Mail, MessageCircle } from "lucide-react";

const Contact = () => {
  const { t } = useApp();

  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      value: "info@aiyujapan.com",
    },
    {
      icon: MessageCircle,
      title: "Facebook",
      value: "Aiyu-Japan",
      href: "https://www.facebook.com/profile.php?id=61566577742246",
    },
    {
      icon: Instagram,
      title: "Instagram",
      value: "@aiyu.japan",
      href: "https://www.instagram.com/aiyu.japan/",
    },
  ];

  const staffMembers = [
    {
      name: "Aimi",
      role: "Content Creation Staff, English Market Manager",
      image: "aimi.png",
      description: "Descripción",
    },
    {
      name: "Sayuki",
      role: "Content Creation Leader",
      image: "sayuki.png",
      description: "Descripción",
    },
  ];

  return (
    <div className="min-h-screen bg-[url(tile_background.png)] bg-repeat animate-fade-in py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("contact")}
          </h1>

          <p className="text-gray-600 text-lg">{t("contactDescription1")}</p>
          <p className="text-gray-600 text-lg">{t("contactDescription2")}</p>
        </div>

        {/* Staff Introductions Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {t("ourStaff")}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {staffMembers.map((member, index) => (
              <Card
                key={index}
                className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <CardContent className="p-8 text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={member.image} alt={member.name} />
                    <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-blue-300 to-blue-400 text-white">
                      {member.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-semibold mb-2">
                    {member.name === "Aimi" ? t("staffRole1") : t("staffRole2")}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Form and Methods Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg h-full">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {t("yourInquiryNotBother")}
                  </h2>
                </div>

                <form
                  action="https://api.web3forms.com/submit"
                  method="POST"
                  className="space-y-6"
                >
                  {/* Web3Forms Access Key */}
                  <input
                    type="hidden"
                    name="access_key"
                    value="e56d5ce5-47a1-4331-acb2-e9e935a66f5c"
                  />

                  {/* Honeypot Spam Protection */}
                  <input
                    type="checkbox"
                    name="botcheck"
                    className="hidden"
                    style={{ display: "none" }}
                  />

                  <div className="space-y-2">
                    <Input
                      type="text"
                      name="name"
                      placeholder={t("contactFormName")}
                      className="w-full"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Input
                      type="email"
                      name="email"
                      placeholder={t("contactFormEmail")}
                      className="w-full"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Textarea
                      name="message"
                      placeholder={t("contactFormMessage")}
                      className="w-full min-h-32"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-auto px-12 py-3 bg-white text-gray-900 border-2 border-gray-900 hover:bg-gray-100 rounded-full font-semibold transition-colors"
                  >
                    {t("contactFormSend")}
                  </button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Methods */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {t("getInTouch")}
            </h3>
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <Card
                  key={index}
                  className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-300 to-blue-400 rounded-full flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {method.title}
                        </h4>
                        <a
                          href={method.href}
                          className="text-blue-600 hover:text-blue-700 transition-colors text-sm"
                        >
                          {method.value}
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
