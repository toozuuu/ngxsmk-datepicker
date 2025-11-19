import { Injectable } from '@angular/core';

/**
 * Calendar system types supported by the datepicker
 */
export type CalendarSystem = 'gregorian' | 'islamic' | 'buddhist' | 'japanese' | 'hebrew' | 'persian';

/**
 * Locale data structure for datepicker localization
 */
export interface LocaleData {
  /** Calendar system used by this locale */
  calendar: CalendarSystem;
  
  /** First day of the week (0 = Sunday, 1 = Monday, etc.) */
  firstDayOfWeek: number;
  
  /** Default date format string (e.g., 'MM/DD/YYYY', 'DD/MM/YYYY') */
  dateFormat: string;
  
  /** Full month names (12 elements) */
  monthNames: string[];
  
  /** Short month names (12 elements) */
  monthNamesShort: string[];
  
  /** Full weekday names (7 elements, starting with Sunday) */
  weekdayNames: string[];
  
  /** Short weekday names (7 elements, starting with Sunday) */
  weekdayNamesShort: string[];
  
  /** Whether this locale uses RTL (right-to-left) text direction */
  isRtl: boolean;
  
  /** Fallback locale if this one is not fully supported */
  fallbackLocale?: string;
  
  /** Locale-specific date format options */
  dateFormatOptions?: {
    year?: 'numeric' | '2-digit';
    month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
    day?: 'numeric' | '2-digit';
    hour?: 'numeric' | '2-digit';
    minute?: 'numeric' | '2-digit';
    hour12?: boolean;
  };
}

/**
 * Service for managing locale data and providing fallback mechanisms
 * Supports multiple calendar systems and provides locale-specific formatting
 */
@Injectable({ providedIn: 'root' })
export class LocaleRegistryService {
  private localeData: Map<string, LocaleData> = new Map();
  private readonly defaultLocale = 'en-US';
  
  constructor() {
    this.registerDefaultLocales();
  }
  
  /**
   * Register locale data for a specific locale
   */
  register(locale: string, data: LocaleData): void {
    this.localeData.set(locale.toLowerCase(), data);
  }
  
  /**
   * Get locale data for a specific locale, with fallback support
   */
  getLocaleData(locale: string): LocaleData {
    const normalizedLocale = locale.toLowerCase();
    
    // Try exact match first
    if (this.localeData.has(normalizedLocale)) {
      return this.localeData.get(normalizedLocale)!;
    }
    
    // Try language code only (e.g., 'en' from 'en-US')
    const parts = normalizedLocale.split('-');
    const languageCode = parts.length > 0 ? parts[0] : normalizedLocale;
    if (languageCode && this.localeData.has(languageCode)) {
      return this.localeData.get(languageCode)!;
    }
    
    // Try fallback chain
    const fallbackLocale = this.getFallbackLocale(normalizedLocale);
    if (fallbackLocale && this.localeData.has(fallbackLocale)) {
      return this.localeData.get(fallbackLocale)!;
    }
    
    // Return default locale as last resort
    return this.localeData.get(this.defaultLocale) || this.getDefaultLocaleData();
  }
  
  /**
   * Get fallback locale for an unsupported locale
   */
  getFallbackLocale(unsupportedLocale: string): string | null {
    const normalized = unsupportedLocale.toLowerCase();
    
    // Check if locale has explicit fallback
    const localeData = this.localeData.get(normalized);
    if (localeData?.fallbackLocale) {
      return localeData.fallbackLocale;
    }
    
    // Try language code only
    const parts = normalized.split('-');
    const languageCode = parts.length > 0 ? parts[0] : normalized;
    if (languageCode && this.localeData.has(languageCode)) {
      return languageCode;
    }
    
    // Common fallback patterns
    const fallbackMap: Record<string, string> = {
      'en': 'en-US',
      'ar': 'ar-SA',
      'zh': 'zh-CN',
      'fr': 'fr-FR',
      'de': 'de-DE',
      'es': 'es-ES',
      'it': 'it-IT',
      'ja': 'ja-JP',
      'ko': 'ko-KR',
      'pt': 'pt-BR',
      'ru': 'ru-RU',
    };
    
    if (languageCode && fallbackMap[languageCode]) {
      return fallbackMap[languageCode];
    }
    
    // Return default locale
    return this.defaultLocale;
  }
  
  /**
   * Check if a locale is RTL
   */
  isRtlLocale(locale: string): boolean {
    const localeData = this.getLocaleData(locale);
    return localeData.isRtl;
  }
  
  /**
   * Get calendar system for a locale
   */
  getCalendarSystem(locale: string): CalendarSystem {
    const localeData = this.getLocaleData(locale);
    return localeData.calendar;
  }
  
  /**
   * Register default locale data for common locales
   */
  private registerDefaultLocales(): void {
    // English (US) - Default
    this.register('en-US', {
      calendar: 'gregorian',
      firstDayOfWeek: 0,
      dateFormat: 'MM/DD/YYYY',
      monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      weekdayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      weekdayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      isRtl: false,
      dateFormatOptions: {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }
    });
    
    // English (UK)
    this.register('en-GB', {
      calendar: 'gregorian',
      firstDayOfWeek: 1,
      dateFormat: 'DD/MM/YYYY',
      monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      weekdayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      weekdayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      isRtl: false,
      fallbackLocale: 'en-US',
      dateFormatOptions: {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }
    });
    
    // Arabic (Saudi Arabia) - RTL
    this.register('ar-SA', {
      calendar: 'islamic',
      firstDayOfWeek: 6, // Saturday
      dateFormat: 'DD/MM/YYYY',
      monthNames: ['محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الثانية', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'],
      monthNamesShort: ['محرم', 'صفر', 'ربيع 1', 'ربيع 2', 'جمادى 1', 'جمادى 2', 'رجب', 'شعبان', 'رمضان', 'شوال', 'قعدة', 'حجة'],
      weekdayNames: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
      weekdayNamesShort: ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'],
      isRtl: true,
      dateFormatOptions: {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }
    });
    
    // Hebrew (Israel) - RTL
    this.register('he-IL', {
      calendar: 'hebrew',
      firstDayOfWeek: 0,
      dateFormat: 'DD/MM/YYYY',
      monthNames: ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'],
      monthNamesShort: ['ינו', 'פבר', 'מרץ', 'אפר', 'מאי', 'יונ', 'יול', 'אוג', 'ספט', 'אוק', 'נוב', 'דצמ'],
      weekdayNames: ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'],
      weekdayNamesShort: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'],
      isRtl: true,
      dateFormatOptions: {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }
    });
    
    // Persian/Farsi (Iran) - RTL
    this.register('fa-IR', {
      calendar: 'persian',
      firstDayOfWeek: 6, // Saturday
      dateFormat: 'YYYY/MM/DD',
      monthNames: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
      monthNamesShort: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
      weekdayNames: ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'],
      weekdayNamesShort: ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش'],
      isRtl: true,
      dateFormatOptions: {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }
    });
    
    // Urdu (Pakistan) - RTL
    this.register('ur-PK', {
      calendar: 'gregorian',
      firstDayOfWeek: 0,
      dateFormat: 'DD/MM/YYYY',
      monthNames: ['جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون', 'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'],
      monthNamesShort: ['جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون', 'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'],
      weekdayNames: ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'],
      weekdayNamesShort: ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'],
      isRtl: true,
      fallbackLocale: 'en-US',
      dateFormatOptions: {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }
    });
    
    // Chinese (Simplified)
    this.register('zh-CN', {
      calendar: 'gregorian',
      firstDayOfWeek: 1,
      dateFormat: 'YYYY-MM-DD',
      monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      monthNamesShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      weekdayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      weekdayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
      isRtl: false,
      dateFormatOptions: {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }
    });
    
    // Japanese
    this.register('ja-JP', {
      calendar: 'japanese',
      firstDayOfWeek: 0,
      dateFormat: 'YYYY/MM/DD',
      monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      monthNamesShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      weekdayNames: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
      weekdayNamesShort: ['日', '月', '火', '水', '木', '金', '土'],
      isRtl: false,
      dateFormatOptions: {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }
    });
    
    // French
    this.register('fr-FR', {
      calendar: 'gregorian',
      firstDayOfWeek: 1,
      dateFormat: 'DD/MM/YYYY',
      monthNames: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
      monthNamesShort: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
      weekdayNames: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
      weekdayNamesShort: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
      isRtl: false,
      dateFormatOptions: {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }
    });
    
    // German
    this.register('de-DE', {
      calendar: 'gregorian',
      firstDayOfWeek: 1,
      dateFormat: 'DD.MM.YYYY',
      monthNames: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
      monthNamesShort: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
      weekdayNames: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
      weekdayNamesShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
      isRtl: false,
      dateFormatOptions: {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }
    });
    
    // Spanish
    this.register('es-ES', {
      calendar: 'gregorian',
      firstDayOfWeek: 1,
      dateFormat: 'DD/MM/YYYY',
      monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
      monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
      weekdayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
      weekdayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
      isRtl: false,
      dateFormatOptions: {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }
    });
    
    // Register language-only codes as fallbacks
    this.register('en', this.getLocaleData('en-US'));
    this.register('ar', this.getLocaleData('ar-SA'));
    this.register('he', this.getLocaleData('he-IL'));
    this.register('fa', this.getLocaleData('fa-IR'));
    this.register('ur', this.getLocaleData('ur-PK'));
    this.register('zh', this.getLocaleData('zh-CN'));
    this.register('ja', this.getLocaleData('ja-JP'));
    this.register('fr', this.getLocaleData('fr-FR'));
    this.register('de', this.getLocaleData('de-DE'));
    this.register('es', this.getLocaleData('es-ES'));
  }
  
  /**
   * Get default locale data (English US)
   */
  private getDefaultLocaleData(): LocaleData {
    return {
      calendar: 'gregorian',
      firstDayOfWeek: 0,
      dateFormat: 'MM/DD/YYYY',
      monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      weekdayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      weekdayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      isRtl: false,
      dateFormatOptions: {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }
    };
  }
}

