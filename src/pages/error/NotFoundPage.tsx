import { BaseErrorPage } from "./ErrorPage";

/**
 * 404 error page. Used in the app's router.
 */
function NotFoundPage() {
  return (
    <BaseErrorPage
      title="Not Found | LangFlow"
      heading="Not Found"
      description="We couldn't find what you're looking for."
    />
  );
}

export default NotFoundPage;
