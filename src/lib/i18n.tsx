import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Lang = "en" | "ar";

const dict = {
  en: {
    appName: "HVAC ERP",
    appTagline: "Project Accounting & Management",
    dashboard: "Dashboard",
    clients: "Clients",
    projects: "Projects",
    sites: "Sites",
    expenses: "Expenses",
    invoices: "Invoices",
    payments: "Payments",
    vendors: "Vendors",
    employees: "Employees",
    attendance: "Attendance",
    payroll: "Payroll",
    inventory: "Inventory",
    materials: "Materials",
    purchaseOrders: "Purchase Orders",
    documents: "Documents",
    reports: "Reports",
    users: "Users & Roles",
    settings: "Settings",
    signIn: "Sign In",
    signUp: "Sign Up",
    signOut: "Sign Out",
    email: "Email",
    password: "Password",
    fullName: "Full Name",
    welcome: "Welcome back",
    createAccount: "Create your account",
    add: "Add",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    search: "Search...",
    actions: "Actions",
    total: "Total",
    revenue: "Revenue",
    totalRevenue: "Total Revenue",
    totalExpenses: "Total Expenses",
    grossProfit: "Gross Profit",
    netProfit: "Net Profit",
    receivables: "Outstanding Receivables",
    payables: "Outstanding Payables",
    activeProjects: "Active Projects",
    completedProjects: "Completed Projects",
    monthlyCashFlow: "Monthly Cash Flow",
    profitability: "Profitability",
    name: "Name",
    company: "Company",
    contact: "Contact",
    mobile: "Mobile",
    address: "Address",
    vatNumber: "VAT Number",
    code: "Code",
    client: "Client",
    status: "Status",
    startDate: "Start Date",
    endDate: "End Date",
    contractValue: "Contract Value",
    budget: "Budget",
    profit: "Profit",
    category: "Category",
    amount: "Amount",
    vat: "VAT",
    date: "Date",
    project: "Project",
    site: "Site",
    vendor: "Vendor",
    paymentMethod: "Payment Method",
    invoiceNumber: "Invoice Number",
    issueDate: "Issue Date",
    dueDate: "Due Date",
    paid: "Paid",
    pending: "Pending",
    description: "Description",
    quantity: "Quantity",
    unitPrice: "Unit Price",
    designation: "Designation",
    salary: "Salary",
    language: "Language",
    noData: "No records yet.",
    confirmDelete: "Are you sure you want to delete this?",
  },
  ar: {
    appName: "نظام إدارة التكييف",
    appTagline: "محاسبة وإدارة المشاريع",
    dashboard: "لوحة التحكم",
    clients: "العملاء",
    projects: "المشاريع",
    sites: "المواقع",
    expenses: "المصروفات",
    invoices: "الفواتير",
    payments: "المدفوعات",
    vendors: "الموردون",
    employees: "الموظفون",
    attendance: "الحضور",
    payroll: "كشف الرواتب",
    inventory: "المخزون",
    materials: "المواد",
    purchaseOrders: "أوامر الشراء",
    documents: "المستندات",
    reports: "التقارير",
    users: "المستخدمون والصلاحيات",
    settings: "الإعدادات",
    signIn: "تسجيل الدخول",
    signUp: "إنشاء حساب",
    signOut: "تسجيل الخروج",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    fullName: "الاسم الكامل",
    welcome: "مرحباً بعودتك",
    createAccount: "أنشئ حسابك",
    add: "إضافة",
    edit: "تعديل",
    delete: "حذف",
    save: "حفظ",
    cancel: "إلغاء",
    search: "بحث...",
    actions: "إجراءات",
    total: "الإجمالي",
    revenue: "الإيرادات",
    totalRevenue: "إجمالي الإيرادات",
    totalExpenses: "إجمالي المصروفات",
    grossProfit: "إجمالي الربح",
    netProfit: "صافي الربح",
    receivables: "الذمم المدينة",
    payables: "الذمم الدائنة",
    activeProjects: "المشاريع النشطة",
    completedProjects: "المشاريع المكتملة",
    monthlyCashFlow: "التدفق النقدي الشهري",
    profitability: "الربحية",
    name: "الاسم",
    company: "الشركة",
    contact: "جهة الاتصال",
    mobile: "الجوال",
    address: "العنوان",
    vatNumber: "الرقم الضريبي",
    code: "الكود",
    client: "العميل",
    status: "الحالة",
    startDate: "تاريخ البدء",
    endDate: "تاريخ الانتهاء",
    contractValue: "قيمة العقد",
    budget: "الميزانية",
    profit: "الربح",
    category: "الفئة",
    amount: "المبلغ",
    vat: "ضريبة",
    date: "التاريخ",
    project: "المشروع",
    site: "الموقع",
    vendor: "المورد",
    paymentMethod: "طريقة الدفع",
    invoiceNumber: "رقم الفاتورة",
    issueDate: "تاريخ الإصدار",
    dueDate: "تاريخ الاستحقاق",
    paid: "مدفوع",
    pending: "معلق",
    description: "الوصف",
    quantity: "الكمية",
    unitPrice: "سعر الوحدة",
    designation: "المسمى الوظيفي",
    salary: "الراتب",
    language: "اللغة",
    noData: "لا توجد سجلات بعد.",
    confirmDelete: "هل أنت متأكد من حذف هذا؟",
  },
} as const;

type Key = keyof typeof dict.en;

interface I18nCtx {
  lang: Lang;
  dir: "ltr" | "rtl";
  setLang: (l: Lang) => void;
  t: (k: Key) => string;
}

const Ctx = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "en";
    return (localStorage.getItem("lang") as Lang) || "en";
  });
  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
      document.documentElement.dir = dir;
    }
  }, [lang, dir]);

  const setLang = (l: Lang) => {
    localStorage.setItem("lang", l);
    setLangState(l);
  };

  const t = (k: Key) => (dict[lang] as Record<string, string>)[k] ?? dict.en[k] ?? k;

  return <Ctx.Provider value={{ lang, dir, setLang, t }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}