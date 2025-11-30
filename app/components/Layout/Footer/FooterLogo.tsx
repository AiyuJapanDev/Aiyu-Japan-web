import React from "react";
import SmallLogo from "/aiyu_logo_small.png";

const FooterLogo = () => {
  return (
    <div className="flex justify-center items-center">
      <img src={SmallLogo} alt="Aiyu Logo" className="w-60 h-auto" />
    </div>
  );
};

export default FooterLogo;
