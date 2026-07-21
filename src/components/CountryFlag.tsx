import type { PhoneCountry } from "../config/siteNetwork";

type CountryFlagProps = {
  country: PhoneCountry;
  className?: string;
};

export default function CountryFlag({ country, className = "" }: CountryFlagProps) {
  return (
    <span aria-label={`Bandeira de ${country.name}`} className={className} role="img">
      {country.flag}
    </span>
  );
}
