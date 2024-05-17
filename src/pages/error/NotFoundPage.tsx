import { BaseErrorPage } from "./ErrorPage";

/**
 * 404 error page. Used in the app's router.
 */

function NotFoundPage() {
  return (
    <BaseErrorPage
      title="Not found"
      description="We couldn't find what you're looking for."
    />
  );
}

export default NotFoundPage;
