import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MarkdownText } from "../markdown-text";

const RECEIPT_MARKDOWN = `Your reservation has been successfully processed! 🎉

---

### 🧾 PAYMENT RECEIPT

**Booking ID:** BK-964264-352
**Status:** ✅ SUCCESS

**Flight Details**
| | |
|---|---|
| **Airline** | AirAsia |
| **Route** | Jakarta (CGK) → Bali (DPS) |

**💰 Total Paid: IDR 980,000**
`;

describe("MarkdownText", () => {
  it("harus merender heading, teks tebal, dan pemisah tanpa sintaks markdown", () => {
    const { container } = render(<MarkdownText text={RECEIPT_MARKDOWN} />);

    expect(
      screen.getByRole("heading", { name: /PAYMENT RECEIPT/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Booking ID:", { selector: "strong" }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/^###/)).not.toBeInTheDocument();
    expect(screen.queryByText(/^\|/)).not.toBeInTheDocument();
    expect(document.querySelector("hr")).toBeInTheDocument();
    expect(container.querySelectorAll("br").length).toBeGreaterThan(0);
  });

  it("harus merender tabel GFM beserta isinya", () => {
    render(<MarkdownText text={RECEIPT_MARKDOWN} />);

    const table = document.querySelector("table");
    expect(table).toBeInTheDocument();
    expect(screen.getByText("AirAsia")).toBeInTheDocument();
    expect(screen.getByText(/Jakarta \(CGK\)/)).toBeInTheDocument();
    expect(screen.getByText(/BK-964264-352/)).toBeInTheDocument();
  });

  it("harus merender daftar, blockquote, dan kode secara normal", () => {
    render(
      <MarkdownText
        text={`
- item satu
- item dua

> catatan penting

\`inline code\`
`}
      />,
    );

    expect(screen.getByText("item satu")).toBeInTheDocument();
    expect(screen.getByText("item dua")).toBeInTheDocument();
    expect(screen.getByText("catatan penting")).toBeInTheDocument();
    expect(screen.getByText("inline code")).toBeInTheDocument();
  });
});
