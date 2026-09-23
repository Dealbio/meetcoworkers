import * as React from "react";
export function Label(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className="mb-2 block text-sm font-semibold text-ink" {...props} />;
}
