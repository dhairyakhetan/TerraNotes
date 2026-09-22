import { Link } from 'react-router';

// Router link for app paths ("/articles"), plain anchor for in-page hashes ("#photos") and external URLs.
export default function SmartLink({ href, ...rest }) {
  if (href.startsWith('/')) return <Link to={href} {...rest} />;
  return <a href={href} {...rest} />;
}
