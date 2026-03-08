"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState, useEffect } from "react";

export function ProductSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentQ = searchParams.get("q") ?? "";
  const [value, setValue] = useState(currentQ);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(currentQ);
  }, [currentQ]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    if (q) {
      router.push(`/products?q=${encodeURIComponent(q)}`);
    } else {
      router.push("/products");
    }
  }

  function handleClear() {
    setValue("");
    router.push("/products");
    inputRef.current?.focus();
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap">
      <label htmlFor="product-search" className="sr-only">
        Search products
      </label>
      <input
        ref={inputRef}
        id="product-search"
        name="q"
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search by name or description…"
        className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
        aria-label="Search products"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800"
        >
          Search
        </button>
        {currentQ && (
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50"
          >
            Clear
          </button>
        )}
      </div>
    </form>
  );
}
