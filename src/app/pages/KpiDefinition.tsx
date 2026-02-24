import { ReactNode } from 'react';
import { useDashboard } from '../context/DashboardContext';

export function KpiDefinition() {
  const { darkMode } = useDashboard();

  const txt1   = darkMode ? '#e2e8f0' : '#0f1e35';
  const txt2   = darkMode ? '#64748b' : '#4a6080';
  const cardBg = darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.9)';
  const border = darkMode ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.12)';

  const SectionTitle = ({ children }: { children: ReactNode }) => (
    <div style={{
      fontFamily: "'Vazirmatn',sans-serif", fontSize: 12, fontWeight: 800,
      color: txt1, textTransform: 'uppercase', letterSpacing: '1px',
      marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8,
    }}>
      {children}
      <div style={{ flex: 1, height: 1, background: border }} />
    </div>
  );

  const Card = ({ title, children }: { title: string; children: ReactNode }) => (
    <div style={{
      background: cardBg,
      border: `1px solid ${border}`,
      borderRadius: 14,
      padding: 16,
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{
        fontFamily: "'Vazirmatn',sans-serif",
        fontSize: 13,
        fontWeight: 800,
        marginBottom: 10,
        color: txt1,
      }}>
        {title}
      </div>
      <div style={{
        fontFamily: "'Vazirmatn',sans-serif",
        fontSize: 12,
        color: txt2,
        lineHeight: 1.8,
        direction: 'rtl',
        textAlign: 'right',
      }}>
        {children}
      </div>
    </div>
  );

  return (
    <div>
      <SectionTitle>📘 KPI Definition — توضیح و فرمول شاخص‌ها</SectionTitle>

      <p style={{
        fontFamily: "'Vazirmatn',sans-serif",
        fontSize: 12,
        color: txt2,
        marginBottom: 18,
        direction: 'rtl',
        textAlign: 'right',
      }}>
        در این صفحه، شاخص‌های کلیدی عملکرد HSE و نحوه محاسبه آن‌ها به زبان ساده و به صورت فارسی توضیح داده شده است تا در تحلیل‌ها و گزارش‌ها
        بتوانید تفسیر دقیق‌تری از نمودارها و اعداد داشته باشید. تمام این شاخص‌ها بر اساس بازه زمانی انتخاب شده در فیلتر تاریخ بالای داشبورد محاسبه می‌شوند.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
        gap: 14,
        marginBottom: 20,
      }}>
        <Card title="📊 نرخ فراوانی حوادث منجر به از دست رفتن زمان — LTIFR">
          <>
            <div>
              <b>LTIFR (Lost Time Injury Frequency Rate)</b> نشان می‌دهد چند حادثه منجر به از دست رفتن زمان کار در ازای هر ۱٬۰۰۰٬۰۰۰ نفر-ساعت کار رخ داده است.
            </div>
            <div style={{ marginTop: 6 }}>
              <b>فرمول:</b> (تعداد حوادث LTI ÷ مجموع نفر-ساعت کار) × ۱٬۰۰۰٬۰۰۰
            </div>
          </>
        </Card>

        <Card title="📊 نرخ فراوانی حوادث ثبت‌شده — TRCFR">
          <>
            <div>
              <b>TRCFR (Total Recordable Case Frequency Rate)</b> نرخ فراوانی کل حوادث ثبت‌شده (شامل LTI، MTC، RWC و ...) در ازای هر ۱٬۰۰۰٬۰۰۰ نفر-ساعت کار را نشان می‌دهد.
            </div>
            <div style={{ marginTop: 6 }}>
              <b>فرمول:</b> (تعداد کل حوادث ثبت‌شده ÷ مجموع نفر-ساعت کار) × ۱٬۰۰۰٬۰۰۰
            </div>
          </>
        </Card>

        <Card title="📊 نرخ شدت — LTSR">
          <>
            <div>
              <b>LTSR (Lost Time Severity Rate)</b> شدت حوادث منجر به از دست رفتن زمان را بر اساس مجموع روزهای ازدست‌رفته در ازای هر ۱٬۰۰۰٬۰۰۰ نفر-ساعت کار نشان می‌دهد.
            </div>
            <div style={{ marginTop: 6 }}>
              <b>فرمول:</b> (مجموع روزهای از دست رفته ÷ مجموع نفر-ساعت کار) × ۱٬۰۰۰٬۰۰۰
            </div>
          </>
        </Card>

        <Card title="📊 نسبت فرهنگ ایمنی — Leading / Lagging Ratio">
          <>
            <div>
              این شاخص نسبت فعالیت‌های پیشگیرانه (Leading) به حوادث و رویدادهای واکنشی (Lagging) را نشان می‌دهد و به صورت نسبت نمایش داده می‌شود.
            </div>
            <div style={{ marginTop: 6 }}>
              <b>فرمول ساده:</b> مجموع فعالیت‌های پیشگیرانه ÷ مجموع شاخص‌های واکنشی
            </div>
            <div style={{ marginTop: 6 }}>
              هرچه این نسبت بالاتر باشد، فرهنگ ایمنی قوی‌تر و تمرکز بیشتر روی اقدامات پیشگیرانه است.
            </div>
          </>
        </Card>
      </div>

      <SectionTitle>🛡️ شاخص‌های پیشگیرانه (Leading Indicators)</SectionTitle>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
        gap: 14,
        marginBottom: 20,
      }}>
        <Card title="📋 Stop / Smart Card">
          <>
            <div>
              تعداد کارت‌های توقف کار یا کارت‌های هوشمند HSE ثبت‌شده در بازه زمانی مورد نظر. این کارت‌ها نشان‌دهنده شناسایی شرایط ناایمن
              و توقف داوطلبانه فعالیت برای ایمن‌سازی محیط هستند.
            </div>
          </>
        </Card>

        <Card title="🎓 HSE Training Man-Hour (HTR)">
          <>
            <div>
              مجموع نفر-ساعت آموزش‌های HSE برگزار شده (تعداد افراد × مدت آموزش) در بازه زمانی انتخاب شده.
            </div>
          </>
        </Card>

        <Card title="👷 Pre-Job Safety Meeting (PJSM)">
          <>
            <div>
              تعداد جلسات ایمنی قبل از شروع کار (Pre-Job) که برای مرور ریسک‌ها و اقدامات کنترلی برگزار شده است.
            </div>
          </>
        </Card>

        <Card title="📌 HSE / Toolbox Meetings, Drill, Audit, Inspection">
          <>
            <ul style={{ paddingRight: 18, margin: 0 }}>
              <li>جلسات HSE و Toolbox Meeting: جلسات کوتاه روزانه/هفتگی برای مرور نکات ایمنی.</li>
              <li>Emergency Drill: مانور و تمرین وضعیت‌های اضطراری.</li>
              <li>Audit &amp; Inspection: ممیزی‌ها و بازرسی‌های برنامه‌ریزی‌شده HSE.</li>
            </ul>
          </>
        </Card>
      </div>

      <SectionTitle>⚠️ شاخص‌های واکنشی (Lagging Indicators)</SectionTitle>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
        gap: 14,
        marginBottom: 20,
      }}>
        <Card title="🚑 LTI, MTC, RWC, FAC">
          <>
            <ul style={{ paddingRight: 18, margin: 0 }}>
              <li><b>LTI:</b> حوادث منجر به از دست رفتن زمان کار.</li>
              <li><b>MTC:</b> موارد نیازمند درمان پزشکی.</li>
              <li><b>RWC:</b> موارد محدودیت در کار بعد از حادثه.</li>
              <li><b>FAC:</b> موارد کمک‌های اولیه بدون از دست رفتن زمان.</li>
            </ul>
          </>
        </Card>

        <Card title="⚡ Near Miss &amp; Unsafe Acts / Conditions">
          <>
            <div>
              <b>Near Miss:</b> رویدادهایی که می‌توانستند منجر به حادثه شوند اما در لحظه آخر اتفاقی رخ نداده است.
            </div>
            <div style={{ marginTop: 6 }}>
              <b>Unsafe Act / Condition:</b> اعمال و شرایط ناایمن شناسایی‌شده در محیط کار.
            </div>
          </>
        </Card>

        <Card title="🌍 شاخص‌های زیست‌محیطی">
          <>
            <div>
              شامل مصرف آب، سوخت، تولید پسماند جامد و پساب، و حوادث زیست‌محیطی (EC) است که در نمودارهای محیط‌زیستی نمایش داده می‌شوند.
            </div>
          </>
        </Card>
      </div>

      <div style={{
        marginTop: 10,
        padding: 10,
        borderRadius: 10,
        border: `1px dashed ${border}`,
        background: darkMode ? 'rgba(15,23,42,0.6)' : 'rgba(191,219,254,0.25)',
        fontFamily: "'Vazirmatn',sans-serif",
        fontSize: 11,
        color: txt2,
        direction: 'rtl',
        textAlign: 'right',
      }}>
        یادآوری: برای تحلیل دقیق‌تر روند شاخص‌ها، حتماً بازه زمانی مورد نظر را از فیلتر تاریخ در بالای داشبورد انتخاب کنید و سپس از صفحه «تحلیل و آنالیز»
        برای مشاهده ترندهای افزایشی و کاهشی استفاده نمایید.
      </div>
    </div>
  );
}

