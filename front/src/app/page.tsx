"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LoadingSpinner } from "./components/loadingSpinner";

export default function Home() {
  const [availableCountries, setAvailableCountries] = useState<Country[]>();
  const [loading, setLoading] = useState(false);

  const fetchAvailableCountries = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      const response = await fetch(`${apiUrl}/countries/available-countries`);

      const data = await response.json();

      setAvailableCountries(data);
    } catch (error) {
      throw new Error("Erro to fetch API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableCountries();
  }, []);

  return (
    <div className="bg-neutral-700 p-10">
      <h1 className="text-center pb-10 text-3xl font-semibold">
        List of countries
      </h1>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div>
          {availableCountries && (
            <div className="flex gap-3 flex-wrap justify-center">
              {availableCountries.map((country) => (
                <Link
                  className="flex justify-center items-center text-center bg-gray-500 border border-neutral-300 px-3 h-[75px] w-[150px]  rounded-md font-medium text-lg cursor-pointer"
                  href={`/countries/${country.name}/${country.countryCode}`}
                >
                  {country.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
