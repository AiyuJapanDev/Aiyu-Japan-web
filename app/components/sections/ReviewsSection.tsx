import { useApp } from "@/contexts/AppContext";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router";
import { Star, CheckCircle } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

export const ReviewsSection = () => {
  const { t } = useApp();

  const reviews = [
    {
      id: 1,
      title: t("review1Title"),
      content: t("review1Content"),
      author: t("review1Author"),
      date: t("review1Date"),
      rating: 5,
      verified: true,
      link: "https://es.trustpilot.com/reviews/690bb3aab2e514032c4d7a3d",
    },
    {
      id: 2,
      title: t("review2Title"),
      content: t("review2Content"),
      author: t("review2Author"),
      date: t("review2Date"),
      rating: 5,
      verified: true,
      link: "https://es.trustpilot.com/reviews/689bfb17cce84b7fd14cb213",
    },
    {
      id: 3,
      title: t("review3Title"),
      content: t("review3Content"),
      author: t("review3Author"),
      date: t("review3Date"),
      rating: 5,
      verified: true,
      link: "https://es.trustpilot.com/reviews/689a1def7868abd477f4484a",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#00aa6c] mb-8">
            {t("reviewsTitle")}
          </h2>
        </div>

        <div className="max-w-6xl mx-auto relative px-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 3000,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {/* Summary Card */}
              <CarouselItem className="pl-4 md:basis-1/4 lg:basis-1/4">
                <Link
                  to={"https://www.trustpilot.com/review/aiyujapan.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <h3 className="text-2xl font-bold mb-2">Excelente</h3>
                    <div className="flex gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div key={star} className="bg-[#00aa6c] p-1 rounded-sm">
                          <Star
                            className="w-5 h-5 text-white fill-white"
                            strokeWidth={0}
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      En base a <span className="underline">5 opiniones</span>
                    </p>
                    <div className="flex items-center gap-2">
                      <Star className="w-6 h-6 text-[#00aa6c] fill-[#00aa6c]" />
                      <span className="font-bold text-xl">Trustpilot</span>
                    </div>
                  </div>
                </Link>
              </CarouselItem>

              {/* Review Cards */}
              {reviews.map((review) => (
                <CarouselItem
                  key={review.id}
                  className="pl-4 md:basis-1/3 lg:basis-1/3"
                >
                  <Link
                    to={review.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full"
                  >
                    <Card className="h-full border-none shadow-none hover:bg-gray-50 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex gap-0.5">
                            {[...Array(review.rating)].map((_, i) => (
                              <div
                                key={i}
                                className="bg-[#00aa6c] p-0.5 rounded-sm"
                              >
                                <Star
                                  className="w-3 h-3 text-white fill-white"
                                  strokeWidth={0}
                                />
                              </div>
                            ))}
                          </div>
                          {review.verified && (
                            <div className="flex items-center gap-1 text-gray-400 text-xs">
                              <CheckCircle className="w-3 h-3" />
                              <span>Verificada</span>
                            </div>
                          )}
                        </div>

                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">
                          {review.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {review.content}
                        </p>

                        <div className="text-xs text-gray-500">
                          <span className="font-bold text-gray-700">
                            {review.author}
                          </span>
                          , {review.date}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-4 w-10 h-10 border-gray-200 text-gray-600 hover:bg-white hover:text-gray-900" />
            <CarouselNext className="hidden md:flex -right-4 w-10 h-10 border-gray-200 text-gray-600 hover:bg-white hover:text-gray-900" />
          </Carousel>
        </div>

        <div className="text-center mt-12">
          <Link
            to="https://www.trustpilot.com/review/aiyujapan.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#0071a2] hover:bg-[#005f8b] text-white font-bold py-3 px-8 rounded-full transition-colors"
          >
            {t("viewMoreReviews")}
          </Link>
        </div>
      </div>
    </section>
  );
};
