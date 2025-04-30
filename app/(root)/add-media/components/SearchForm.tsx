"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { searchFormSchema } from "@/lib/schema";
import SearchResults from "@/components/SearchResult";

type SearchFormProps = {
  itemType: string;
  isSearching: boolean;
  setIsSearching: (value: boolean) => void;
};

type SearchFormData = z.infer<typeof searchFormSchema>;

const SearchForm = ({
  itemType,
  isSearching,
  setIsSearching,
}: SearchFormProps) => {
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    setResults([]);
  }, [itemType]);

  const searchForm = useForm<SearchFormData>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: { query: "" },
  });

  async function onSearch(values: SearchFormData) {
    setIsSearching(true);

    try {
      const response = await fetch(
        `/api/search?type=${encodeURIComponent(
          itemType
        )}&query=${encodeURIComponent(values.query)}`
      );

      if (!response.ok) {
        throw new Error("API error");
      }
      const result = await response.json();
      setResults(result.results);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
      searchForm.reset();
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">
        Search for <span className="capitalize">{itemType}</span>
      </h2>
      <Form {...searchForm}>
        <form
          onSubmit={searchForm.handleSubmit(onSearch)}
          className="space-y-4"
        >
          <FormField
            control={searchForm.control}
            name="query"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      placeholder="Search"
                      className="pr-2"
                      disabled={isSearching}
                    />
                    <SearchIcon
                      className={cn(
                        "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground",
                        isSearching && "opacity-50"
                      )}
                    />
                  </div>
                </FormControl>
                <p className="text-sm text-muted-foreground mt-2 italic">
                  Search by title or keywords to find items.
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="bg-[#79C7C5] hover:bg-[#67b5b3]"
            disabled={isSearching}
          >
            {isSearching ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              "Search"
            )}
          </Button>
        </form>
      </Form>
      {results.length > 0 && (
        <SearchResults mediaType={itemType} results={results} />
      )}
    </div>
  );
};

export default SearchForm;
