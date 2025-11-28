import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApp } from "@/contexts/AppContext";
import { ExternalLink, Search, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

export const PopularMarketsSection = () => {
  const { t } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const markets = [
    {
      name: "Mercari JP",
      description: "Japan's largest flea market app",
      categories: [t("marketsCategoryFigures"), t("marketsCategorySecondHand")],
      color: "bg-blue-500",
      items: "50M+",
    },
    {
      name: "Yahoo! Auctions",
      description: "Best place for rare items",
      categories: [
        t("marketsCategoryCollectors"),
        t("marketsCategoryAuctions"),
      ],
      color: "bg-yellow-500",
      items: "70M+",
    },
    {
      name: "Rakuten",
      description: "Massive online shopping mall",
      categories: [t("marketsCategoryRetail"), t("marketsCategoryOfficial")],
      color: "bg-blue-700",
      items: "200M+",
    },
    {
      name: "Amazon Japan",
      description: "Fast shipping & huge selection",
      categories: [t("marketsCategoryRetail"), t("marketsCategoryMarketplace")],
      color: "bg-orange-500",
      items: "100M+",
    },
    {
      name: "Surugaya",
      description: "Otaku & hobby specialist",
      categories: [t("marketsCategoryAnime"), t("marketsCategoryFigures")],
      color: "bg-blue-600",
      items: "10M+",
    },
    {
      name: "Mandarake",
      description: "Vintage anime & manga",
      categories: [t("marketsCategoryCollectors"), t("marketsCategoryAnime")],
      color: "bg-blue-600",
      items: "5M+",
    },
  ];

  const storeCategories = {
    general_and_anime_goods: [
      /* Marketplace General */
      {
        name: t("amazonJapan"),
        url: "https://www.amazon.co.jp/",
        description: t("amazonJapanDesc"),
        logo: "amazon.png",
      },
      {
        name: t("rakuten"),
        url: "https://www.rakuten.co.jp/",
        description: t("rakutenDesc"),
        logo: "rakuten.png",
      },
      {
        name: t("yahooShopping"),
        url: "https://paypayfleamarket.yahoo.co.jp/",
        description: t("yahooShoppingDesc"),
        logo: "yahoo.png",
      },
      {
        name: t("mercariJapan"),
        url: "https://jp.mercari.com/",
        description: t("mercariJapanDesc"),
        logo: "mercari.png",
      },
      {
        name: t("buyma"),
        url: "https://www.buyma.com/",
        description: t("buymaDesc"),
        logo: "buyma.png",
      },
    ],
    official_anime_stores: [
      /* Anime, Manga y Merchandising */
      {
        name: t("surugaya"),
        url: "https://www.suruga-ya.jp/",
        description: t("surugayaDesc"),
        logo: "surugaya.png",
      },
      {
        name: t("mandarake"),
        url: "https://www.mandarake.co.jp/",
        description: t("mandarakeDesc"),
        logo: "mandarake.png",
      },
      {
        name: t("animate"),
        url: "https://www.animate-onlineshop.jp/",
        description: t("animateDesc"),
        logo: "animate.png",
      },
      {
        name: t("jumpShop"),
        url: "https://www.googleadservices.com/pagead/aclk?sa=L&ai=DChcSEwjcm66vh5-KAxUal7kFHUkQByQYABAAGgJ0bQ",
        description: t("jumpShopDesc"),
        logo: "jump.png",
      },
      {
        name: t("chiikawaStore"),
        url: "https://chiikawamarket.jp/",
        description: t("chiikawaStoreDesc"),
        logo: "chiikawa.png",
      },
      {
        name: t("cdJapan"),
        url: "https://www.cdjapan.co.jp/",
        description: t("cdJapanDesc"),
        logo: "CDJapan.png",
      },
      {
        name: t("evangelionStore"),
        url: "https://www.evastore.jp/shop/",
        description: t("evangelionStoreDesc"),
        logo: "eva.png",
      },
      {
        name: t("pokemonCenter"),
        url: "https://www.pokemoncenter-online.com/",
        description: t("pokemonCenterDesc"),
        logo: "pokemon.png",
      },
      {
        name: t("sailorMoonStore"),
        url: "https://sailormoon-store.com/shop/default.aspx",
        description: t("sailorMoonStoreDesc"),
        logo: "sailormoon.png",
      },
      {
        name: t("sanrioStore"),
        url: "https://shop.sanrio.co.jp/",
        description: t("sanrioStoreDesc"),
        logo: "sanrio.png",
      },
      {
        name: t("studioGhibliStore"),
        url: "https://www.donguri-sora.com/",
        description: t("studioGhibliStoreDesc"),
        logo: "ghibli.png",
      },
      {
        name: t("usjStore"),
        url: "https://www.onlinestore.usj.co.jp/",
        description: t("usjStoreDesc"),
        logo: "usj.png",
      },
      {
        name: t("disneyStore"),
        url: "https://store.disney.co.jp/",
        description: t("disneyStoreDesc"),
        logo: "disney.png",
      },
    ],
    figures_and_collectibles: [
      /* Figuras y Juguetes de Colección */
      {
        name: t("mediaWorld"),
        url: "https://mediaworld.co.jp/?srsltid=AfmBOorw5PlhviizHbBrw5PGUDZ4FADX9GImZWgxrTScP6BfAt30h7Oe",
        description: t("mediaWorldDesc"),
        logo: "mediaworld.png",
      },
      {
        name: t("banpresto"),
        url: "https://bsp-prize.jp/",
        description: t("banprestoDesc"),
        logo: "banpresto.png",
      },
      {
        name: t("popMart"),
        url: "https://www.popmart.co.jp/",
        description: t("popMartDesc"),
        logo: "popmart.png",
      },
      {
        name: t("sylvanianFamilies"),
        url: "https://www.sylvanianfamilies.com/ja-jp/",
        description: t("sylvanianFamiliesDesc"),
        logo: "sylvanian.png",
      },
      {
        name: t("amiAmi"),
        url: "https://www.amiami.jp/",
        description: t("amiAmiDesc"),
        logo: "amiami.png",
      },
      {
        name: t("goodSmileOnline"),
        url: "https://www.goodsmile.com/ja",
        description: t("goodSmileOnlineDesc"),
        logo: "goodsmile.png",
      },
    ],
    fashion_and_lifestyle: [
      /* Ropa y Accesorios */
      {
        name: t("uniqlo"),
        url: "https://www.uniqlo.com/jp/ja/",
        description: t("uniqloDesc"),
        logo: "uniqlo.png",
      },
      {
        name: t("gu"),
        url: "https://www.gu-global.com/jp/ja/",
        description: t("guDesc"),
        logo: "gu.png",
      },
      {
        name: t("zozotown"),
        url: "https://zozo.jp/",
        description: t("zozotownDesc"),
        logo: "zozo.png",
      },
      {
        name: t("graniph"),
        url: "https://www.graniph.com/",
        description: t("graniphDesc"),
        logo: "graniph.png",
      },
      {
        name: t("weverseShop"),
        url: "https://shop.weverse.io/ja/home",
        description: t("weverseShopDesc"),
        logo: "weverse.png",
      },
      {
        name: t("btsOfficialShop"),
        url: "https://bts-officialshop.jp/",
        description: t("btsOfficialShopDesc"),
        logo: "bts.png",
      },
      {
        name: t("newEra"),
        url: "https://www.neweracap.jp/",
        description: t("newEraDesc"),
        logo: "newera.png",
      },
      {
        name: t("onitsukaTiger"),
        url: "https://www.onitsukatiger.com/jp",
        description: t("onitsukaTigerDesc"),
        logo: "onitsuka.png",
      },
      {
        name: t("crocsJapan"),
        url: "https://www.crocs.co.jp/",
        description: t("crocsJapanDesc"),
        logo: "crocs.png",
      },
      {
        name: t("humanMadeJapan"),
        url: "https://humanmade.jp/",
        description: t("humanMadeJapanDesc"),
        logo: "humanmade.png",
      },
      {
        name: t("adidasJapan"),
        url: "https://www.adidas.jp/",
        description: t("adidasJapanDesc"),
        logo: "adidas.png",
      },
      {
        name: t("nikeJapan"),
        url: "https://nike.jp/",
        description: t("nikeJapanDesc"),
        logo: "nike.png",
      },
      {
        name: t("stripeClub"),
        url: "https://stripe-club.com/",
        description: t("stripeClubDesc"),
        logo: "stripe.png",
      },
    ],
    household_and_misc: [
      /* Artículos para el Hogar y Decoración */
      {
        name: t("daisoJapan"),
        url: "https://jp.daisonet.com",
        description: t("daisoJapanDesc"),
        logo: "daiso.png",
      },
      {
        name: t("nitori"),
        url: "https://www.nitori-net.jp/ec/",
        description: t("nitoriDesc"),
        logo: "nitori.png",
      },
      {
        name: t("loft"),
        url: "https://www.loft.co.jp/",
        description: t("loftDesc"),
        logo: "loft.png",
      },
      {
        name: t("palCloset"),
        url: "https://www.palcloset.jp/",
        description: t("palClosetDesc"),
        logo: "palcloset.png",
      },
      {
        name: t("yodobashiCamera"),
        url: "https://www.yodobashi.com/",
        description: t("yodobashiCameraDesc"),
        logo: "yodobashi.png",
      },
      {
        name: t("mujiJapan"),
        url: "https://www.muji.com/jp/ja/store",
        description: t("mujiJapanDesc"),
        logo: "muji.png",
      },
    ],
    beauty_and_cosmetics: [
      /* Belleza y Cosméticos */
      {
        name: t("oliveYoungGlobal"),
        url: "https://global.oliveyoung.com/",
        description: t("oliveYoungGlobalDesc"),
        logo: "oliveyoung.png",
      },
      {
        name: t("cosmeCom"),
        url: "https://www.cosme.com/",
        description: t("cosmeComDesc"),
        logo: "cosme.png",
      },
      {
        name: t("amazonJapan"),
        url: "https://www.amazon.co.jp/",
        description: t("amazonJapanDesc"),
        logo: "amazon.png",
      },
      {
        name: t("rakuten"),
        url: "https://www.rakuten.co.jp/",
        description: t("rakutenDesc"),
        logo: "rakuten.png",
      },
    ],
  };

  const categoryLabels = {
    all: t("allCategories"),
    general_and_anime_goods: t("generalMarketplace"),
    official_anime_stores: t("animeMangaMerchandising"),
    fashion_and_lifestyle: t("fashionAccessories"),
    household_and_misc: t("householdDecoration"),
    beauty_and_cosmetics: t("beautyCosmetics"),
    figures_and_collectibles: t("figuresCollectibles"),
  };

  const getFilteredStores = () => {
    if (selectedCategory === "all") {
      return Object.entries(storeCategories).flatMap(([category, stores]) =>
        stores.map((store) => ({ ...store, category }))
      );
    }
    return (
      storeCategories[selectedCategory as keyof typeof storeCategories]?.map(
        (store) => ({ ...store, category: selectedCategory })
      ) || []
    );
  };

  const StoreCard = (market, index) => (
    <div
      key={index}
      className="overflow-clip border group relative rounded-2xl bg-white  shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl col-span-1"
    >
      <div className=" mb-4 flex items-center justify-between bg-capybara-blue px-4 py-2">
        <div className="rounded-full border overflow-clip w-20 p-1 ">
          <img
            src={market.logo}
            alt={market.name}
            className="w-full h-full rounded-full"
          />
        </div>
        <Button
          asChild
          className="flex p-6 items-center justify-center gap-2 rounded-xl bg-gray-800  py-3 font-medium text-white transition-colors hover:bg-gray-700"
        >
          <Link to={market.url} target="_blank">
            {t("marketsExplore")}
            <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="px-4 pb-6">
        <h3 className="mb-2 text-xl font-bold text-gray-900">{market.name}</h3>
        <p className="mb-4 text-gray-600">{market.description}</p>
        <div className=" space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            {t("marketsMainCategory")}
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
              {market.category}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
  const StoreCard2 = (market, index) => (
    <div
      key={index}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-200 overflow-hidden group"
    >
      {/* Header with gradient */}
      <div
        className={`bg-gradient-to-br ${market.color} p-6 text-gray-900 relative overflow-hidden`}
      >
        <div className="absolute top-0 left-0 w-24 h-24 bg-capybara-blue  rounded-full ">
          <img src={market.logo} alt={market.name} />
        </div>
        <div className="relative">
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs mb-3 backdrop-blur-sm">
            {market.category}
          </span>
          <h4 className="text-gray-900 mb-2">{market.name}</h4>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-sm text-gray-700 mb-4 leading-relaxed">
          {market.description}
        </p>
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-1">Main categories:</p>
          <p className="text-sm text-gray-900">{market.items}</p>
        </div>
        <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 group-hover:bg-cyan-600 group-hover:text-white">
          <span className="text-sm">Explore</span>
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            {t("marketsTitle")}
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            {t("marketsSubtitle")}
          </p>
        </div>

        <div className="mb-6">
          <div className="max-w-md mx-auto">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("selectCategory")} />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          {categoryLabels[selectedCategory as keyof typeof categoryLabels]}
        </h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {getFilteredStores().map((market, index) => StoreCard(market, index))}
        </div>

        <div className="mt-16 rounded-3xl bg-white p-8 shadow-lg md:p-12">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div>
              <h3 className="mb-2 text-2xl font-bold text-gray-900">
                {t("marketsNotFoundTitle")}
              </h3>
              <p className="max-w-xl text-gray-600">
                {t("marketsNotFoundDesc")}
              </p>
            </div>
            <button className="flex-shrink-0 rounded-full bg-blue-600 px-8 py-4 font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-blue-700">
              {t("marketsContactSupport")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
