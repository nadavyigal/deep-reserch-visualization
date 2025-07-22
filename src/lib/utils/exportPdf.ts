import { Section } from './parseSections';

interface ExportOptions {
  element: HTMLElement;
  user: any;
  sections: Section[];
  researchContent: string;
}

export async function exportResearchToPdf({ element, user, sections, researchContent }: ExportOptions) {
  if (!element || !user) return;

  const html2pdf = (await import('html2pdf.js')).default;
  element.classList.add('pdf-export');
  const chartContainers = element.querySelectorAll('.flowchart-container, .chart-container');
  chartContainers.forEach((container) => {
    if (container instanceof HTMLElement) {
      container.style.height = 'auto';
      container.style.minHeight = '400px';
      container.style.overflow = 'visible';
    }
  });

  const documentTitle = sections.length > 0 && sections[0].title ? sections[0].title : 'Research Document';
  const timestamp = Date.now();
  const filename = `${documentTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${timestamp}.pdf`;

  const opt = {
    margin: 10,
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: true, letterRendering: true, allowTaint: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const, compress: true }
  };

  const pdfBlob = await html2pdf().set(opt).from(element).output('blob');

  const { ref: storageRef, uploadBytes, getDownloadURL } = await import('firebase/storage');
  const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
  const { storage, db } = await import('../firebase/firebase');

  if (!storage) throw new Error('Storage is not initialized');
  const fileRef = storageRef(storage, `documents/${user.uid}/${filename}`);
  await uploadBytes(fileRef, pdfBlob);
  const downloadURL = await getDownloadURL(fileRef);

  if (!db) throw new Error('Database is not initialized');
  await addDoc(collection(db, 'documents'), {
    title: documentTitle,
    userId: user.uid,
    createdAt: serverTimestamp(),
    fileUrl: downloadURL,
    fileName: filename,
    contentPreview: researchContent.substring(0, 200) + (researchContent.length > 200 ? '...' : '')
  });

  element.classList.remove('pdf-export');
  chartContainers.forEach((container) => {
    if (container instanceof HTMLElement) {
      container.style.height = '';
      container.style.minHeight = '';
      container.style.overflow = '';
    }
  });
}
