"use client";

import ItemTypeSelector from "./components/ItemTypeSelector";
import { Suspense, useEffect, useState } from "react";
import SearchForm from "./components/SearchForm";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// This component will use the search params
function AddItemContent() {
  const searchParams = useSearchParams();
  const typeFromQuery = searchParams.get("type");
  const router = useRouter();
  const pathname = usePathname();
  const [itemType, setItemType] = useState(typeFromQuery);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (itemType !== typeFromQuery) {
      const params = new URLSearchParams(searchParams);
      params.set("type", itemType);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [itemType, typeFromQuery, pathname, router, searchParams]);

  return (
    <>
      <ItemTypeSelector
        itemType={itemType}
        setItemType={setItemType}
        disabled={isSearching}
      />
      <SearchForm
        itemType={itemType}
        isSearching={isSearching}
        setIsSearching={setIsSearching}
      />
    </>
  );
}

// Main component with Suspense boundary
const AddItemPage = () => {
  return (
    <div className="m-7 space-y-8">
      <h1 className="text-3xl font-bold">Add Item</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <AddItemContent />
      </Suspense>
    </div>
  );
};

export default AddItemPage;