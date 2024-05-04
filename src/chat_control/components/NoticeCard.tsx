import { basicTextTailwind } from '../../utils/ui/TailwindConsts';

/**
 * @description Show every single notice in the `NoticesBar`.
 */
export function NoticeCard({ notice }: Props) {
  return <div className={`m-0.5 text-xs ${basicTextTailwind}`}>{notice}</div>;
}

interface Props {
  notice: string;
}
