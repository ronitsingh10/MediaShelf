"use client";

import ItemTypeSelector from "./components/ItemTypeSelector";
import { useEffect, useState } from "react";
import SearchForm from "./components/SearchForm";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const AddItemPage = () => {
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
  }, [itemType]);

  return (
    <div className="m-7 space-y-8">
      <h1 className="text-3xl font-bold">Add Item</h1>
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
    </div>
  );
};

export default AddItemPage;
