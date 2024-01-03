import clsx from 'clsx';
import { useMemo, useState } from 'react';
import './styles.less';
export default function ProjectLogo({ className, src = '', alt }: { className?: string; src?: string; alt?: string }) {
  const [err, setErr] = useState<boolean>();
  const errTip = useMemo(() => {
    if (typeof alt === 'string') return alt[0].toUpperCase();
    return 'E';
  }, [alt]);
  if (!err) return <img alt={alt} className={clsx('project-logo', className)} src={src} onError={() => setErr(true)} />;
  return <div className={clsx('project-logo', className)}>{errTip}</div>;
}
