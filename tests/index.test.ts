import { toHtml } from "hast-util-to-html";
import { rehype } from "rehype";
import rehypeMinifyWhitespace from "rehype-minify-whitespace";
import { readSync } from "to-vfile";
import { expect, test } from "vitest";
import rehypeSectionize, { type RehypeSectionizeOptions } from "../src";

const planeProcessor = rehype()
  .data("settings", { fragment: true })
  .use(rehypeMinifyWhitespace);

const run = (name: string, options?: RehypeSectionizeOptions) => {
  const processor = rehype()
    .data("settings", { fragment: true })
    .use(rehypeSectionize, options)
    .use(rehypeMinifyWhitespace);

  const input = toHtml(
    processor.runSync(
      processor.parse(
        readSync(`./tests/fixtures/${name}/input.html`).toString(),
      ),
    ),
  );

  const output = toHtml(
    planeProcessor.runSync(
      planeProcessor.parse(
        readSync(`./tests/fixtures/${name}/output.html`).toString(),
      ),
    ),
  );

  test(name, () => {
    expect(input).toBe(output);
  });
};

run("basic");
run("complexNests");
run("headingId");
run("enableRootSection", { enableRootSection: true });
run("properties", { properties: { className: ["changed"] } });
run("idPropertyName", { idPropertyName: "dataChanged" });
run("rankPropertyName", { rankPropertyName: "dataChanged" });
run("nonRankPropertyName", { rankPropertyName: undefined });
run("classPropertyValue", { classPropertyValue: "changed" });
