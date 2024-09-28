"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/app/components/loadingSpinner";
import { BarChart } from "@/app/components/BarChart";

export default function CountryDetails({
  params,
}: {
  params: { country: string; countryCode: string };
}) {
  const [countryDetails, setCountryDetails] = useState<CountryDetails>();
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const { countryCode, country } = params;

  const fetchCountryDetails = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      const response = await fetch(`${apiUrl}/countries/details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ country, countryCode }),
      });

      const data = await response.json();

      setCountryDetails(data);
    } catch (error) {
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountryDetails();
  }, []);

  return (
    <div>
      <div className="bg-neutral-900 py-10 px-8 gap-10">
        <Link
          href={`/`}
          className="bg-gray-500 px-3 py-2 rounded-xl font-medium text-lg cursor-pointer"
        >
          Go back to the list
        </Link>

        <p className="text-center text-3xl font-bold">{country}</p>
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div>
          {countryDetails && (
            <div className="mt-10 flex flex-col justify-center">
              <div className="flex flex-col items-center gap-5">
                {countryDetails.flag ? (
                  <Image
                    alt={country}
                    src={countryDetails.flag}
                    width={200}
                    height={200}
                  />
                ) : (
                  <p>No flag available</p>
                )}

                <p className="font-semibold text-xl mt-10">Border Countries </p>
                <div className="flex gap-3">
                  {countryDetails.borders.map((border) => (
                    <Link
                      className="bg-gray-500 px-3 rounded-xl font-medium text-lg cursor-pointer"
                      href={`/countries/${border.commonName}/${border.countryCode}`}
                    >
                      {border.commonName}
                    </Link>
                  ))}
                </div>
              </div>

              {}
              <p className="font-semibold text-xl mt-10 text-center">
                Population over the years
              </p>

              {countryDetails.populationCounts && (
                <div className="flex justify-center w-full">
                  <BarChart
                    data={[
                      ["Year", "Population"],
                      ...countryDetails.populationCounts.map((count) => [
                        ...Object.values(count),
                      ]),
                    ]}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
