"use client";

import { type Currency, useCurrency } from "@/lib/currency-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const currencies = [
  { value: "NGN", label: "Nigerian Naira (₦)" },
  { value: "USD", label: "US Dollar ($)" },
  { value: "GBP", label: "British Pound (£)" },
  { value: "EUR", label: "Euro (€)" },
  { value: "CAD", label: "Canadian Dollars (C$)" },
];

export function CurrencySelector({
  onValueChange,
}: {
  onValueChange?: (value: Currency) => void;
}) {
  const { currency, setCurrency } = useCurrency();

  const handleValueChange = async (value: string) => {
    const currencyValue = value as Currency;

    // If external handler is provided, use it
    if (onValueChange) {
      onValueChange(currencyValue);
    } else {
      // Otherwise use the context's setCurrency
      await setCurrency(currencyValue);
    }
  };

  return (
    <Select value={currency} onValueChange={handleValueChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select currency" />
      </SelectTrigger>
      <SelectContent>
        {currencies.map((c) => (
          <SelectItem key={c.value} value={c.value}>
            {c.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
