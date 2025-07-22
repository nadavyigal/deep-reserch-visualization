export interface Section {
  title: string;
  content: string;
  level: number;
}

export function parseSections(researchContent: string): Section[] {
  if (!researchContent) return [];

  const lines = researchContent.split('\n');
  const extracted: Section[] = [];
  let current: Section | null = null;

  const pushCurrent = () => {
    if (current) {
      extracted.push(current);
      current = null;
    }
  };

  if (researchContent.trim()) {
    lines.forEach((line, index) => {
      const markdownHeaderMatch = line.match(/^(#{1,3})\s+(.+)$/);
      const numberedHeaderMatch = line.match(/^(\d+)\.\s+(.+)$/);

      if (markdownHeaderMatch) {
        pushCurrent();
        const headerLevel = markdownHeaderMatch[1].length;
        const headerTitle = markdownHeaderMatch[2].trim();
        current = {
          title: headerTitle,
          content: line + '\n',
          level: headerLevel
        };
      } else if (numberedHeaderMatch && (index === 0 || lines[index-1].trim() === '')) {
        pushCurrent();
        const headerTitle = numberedHeaderMatch[2].trim();
        const formattedHeader = `## ${headerTitle}`;
        current = {
          title: headerTitle,
          content: formattedHeader + '\n',
          level: 2
        };
      } else if (current) {
        current.content += line + '\n';
      } else if (line.trim() !== '') {
        current = {
          title: 'Main Content',
          content: line + '\n',
          level: 1
        };
      }
    });
    pushCurrent();
    if (extracted.length === 0) {
      extracted.push({
        title: 'Research Content',
        content: researchContent,
        level: 1
      });
    }
  }

  return extracted;
}
