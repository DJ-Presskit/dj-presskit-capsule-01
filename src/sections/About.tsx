/**
 * About Section
 * Uses useI18n hook for translations
 */

import { Text } from "@/components/ui";
import { OutlineTitle } from "@/components/ui/OutlineTitle";
import { useI18n } from "@/core/i18n";

export function About() {
  return (
    <section id="about" className="section-py">
      <OutlineTitle title="BIO" outlineTitle="about.title" />
    </section>
  );
}

export default About;
