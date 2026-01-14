
import { supportedLocales } from "@/lib/i18n";
import { data, Outlet, redirect } from "react-router";
import { Route } from ".react-router/types/app/routes/LocaleLayout";

export async function loader({ request, params }: Route.LoaderArgs) {
    const locale = params.lang;

    // 1. Handle missing locale for specific routes like /services -> Redirect to default
    if (!locale) {
        const url = new URL(request.url);
        // Avoid double slashes if pathname is just /
        const path = url.pathname === "/" ? "" : url.pathname;
        return redirect(`/es${path}${url.search}`);
    }

    // 2. Validate locale -> 404 if not supported
    // This catches /foo (where foo matches :lang)
    if (!supportedLocales.includes(locale)) {
        throw data("Language not supported", { status: 404 });
    }

    return { locale };
}

export default function LocaleLayout() {
    return <Outlet />;
}
