export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      attendance: {
        Row: {
          created_at: string | null
          date: string
          employee_id: string
          hours_worked: number | null
          id: string
          notes: string | null
          overtime_hours: number | null
          project_id: string | null
          site_id: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          employee_id: string
          hours_worked?: number | null
          id?: string
          notes?: string | null
          overtime_hours?: number | null
          project_id?: string | null
          site_id?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          employee_id?: string
          hours_worked?: number | null
          id?: string
          notes?: string | null
          overtime_hours?: number | null
          project_id?: string | null
          site_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          changes: Json | null
          created_at: string | null
          id: string
          record_id: string | null
          table_name: string
          user_id: string | null
        }
        Insert: {
          action: string
          changes?: Json | null
          created_at?: string | null
          id?: string
          record_id?: string | null
          table_name: string
          user_id?: string | null
        }
        Update: {
          action?: string
          changes?: Json | null
          created_at?: string | null
          id?: string
          record_id?: string | null
          table_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      bill_payments: {
        Row: {
          amount: number
          bill_id: string | null
          created_at: string | null
          id: string
          method: Database["public"]["Enums"]["payment_method"] | null
          notes: string | null
          payment_date: string
          reference_no: string | null
          vendor_id: string | null
        }
        Insert: {
          amount?: number
          bill_id?: string | null
          created_at?: string | null
          id?: string
          method?: Database["public"]["Enums"]["payment_method"] | null
          notes?: string | null
          payment_date?: string
          reference_no?: string | null
          vendor_id?: string | null
        }
        Update: {
          amount?: number
          bill_id?: string | null
          created_at?: string | null
          id?: string
          method?: Database["public"]["Enums"]["payment_method"] | null
          notes?: string | null
          payment_date?: string
          reference_no?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bill_payments_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "vendor_bills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bill_payments_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          company_name: string | null
          contact_person: string | null
          created_at: string | null
          created_by: string | null
          email: string | null
          id: string
          mobile: string | null
          name: string
          notes: string | null
          updated_at: string | null
          vat_number: string | null
        }
        Insert: {
          address?: string | null
          company_name?: string | null
          contact_person?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          mobile?: string | null
          name: string
          notes?: string | null
          updated_at?: string | null
          vat_number?: string | null
        }
        Update: {
          address?: string | null
          company_name?: string | null
          contact_person?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          mobile?: string | null
          name?: string
          notes?: string | null
          updated_at?: string | null
          vat_number?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          category: string | null
          client_id: string | null
          file_type: string | null
          file_url: string
          id: string
          name: string
          notes: string | null
          project_id: string | null
          uploaded_at: string | null
          uploaded_by: string | null
          vendor_id: string | null
        }
        Insert: {
          category?: string | null
          client_id?: string | null
          file_type?: string | null
          file_url: string
          id?: string
          name: string
          notes?: string | null
          project_id?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
          vendor_id?: string | null
        }
        Update: {
          category?: string | null
          client_id?: string | null
          file_type?: string | null
          file_url?: string
          id?: string
          name?: string
          notes?: string | null
          project_id?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          accommodation: string | null
          allowances: number | null
          basic_salary: number | null
          created_at: string | null
          designation: string | null
          email: string | null
          employee_code: string | null
          full_name: string
          id: string
          joining_date: string | null
          mobile: string | null
          nationality: string | null
          qid: string | null
          qid_expiry: string | null
          status: string | null
          updated_at: string | null
          visa_expiry: string | null
          visa_number: string | null
        }
        Insert: {
          accommodation?: string | null
          allowances?: number | null
          basic_salary?: number | null
          created_at?: string | null
          designation?: string | null
          email?: string | null
          employee_code?: string | null
          full_name: string
          id?: string
          joining_date?: string | null
          mobile?: string | null
          nationality?: string | null
          qid?: string | null
          qid_expiry?: string | null
          status?: string | null
          updated_at?: string | null
          visa_expiry?: string | null
          visa_number?: string | null
        }
        Update: {
          accommodation?: string | null
          allowances?: number | null
          basic_salary?: number | null
          created_at?: string | null
          designation?: string | null
          email?: string | null
          employee_code?: string | null
          full_name?: string
          id?: string
          joining_date?: string | null
          mobile?: string | null
          nationality?: string | null
          qid?: string | null
          qid_expiry?: string | null
          status?: string | null
          updated_at?: string | null
          visa_expiry?: string | null
          visa_number?: string | null
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          approved_by: string | null
          attachment_url: string | null
          category: Database["public"]["Enums"]["expense_category"]
          created_at: string | null
          created_by: string | null
          description: string | null
          employee_id: string | null
          expense_date: string
          id: string
          notes: string | null
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          project_id: string | null
          reference_no: string | null
          site_id: string | null
          status: Database["public"]["Enums"]["approval_status"] | null
          subcategory: string | null
          total_amount: number | null
          updated_at: string | null
          vat_amount: number | null
          vendor_id: string | null
        }
        Insert: {
          amount?: number
          approved_by?: string | null
          attachment_url?: string | null
          category: Database["public"]["Enums"]["expense_category"]
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          employee_id?: string | null
          expense_date?: string
          id?: string
          notes?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          project_id?: string | null
          reference_no?: string | null
          site_id?: string | null
          status?: Database["public"]["Enums"]["approval_status"] | null
          subcategory?: string | null
          total_amount?: number | null
          updated_at?: string | null
          vat_amount?: number | null
          vendor_id?: string | null
        }
        Update: {
          amount?: number
          approved_by?: string | null
          attachment_url?: string | null
          category?: Database["public"]["Enums"]["expense_category"]
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          employee_id?: string | null
          expense_date?: string
          id?: string
          notes?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          project_id?: string | null
          reference_no?: string | null
          site_id?: string | null
          status?: Database["public"]["Enums"]["approval_status"] | null
          subcategory?: string | null
          total_amount?: number | null
          updated_at?: string | null
          vat_amount?: number | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_movements: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          material_id: string
          movement_date: string
          movement_type: string
          notes: string | null
          project_id: string | null
          quantity: number
          reference: string | null
          site_id: string | null
          unit_cost: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          material_id: string
          movement_date?: string
          movement_type: string
          notes?: string | null
          project_id?: string | null
          quantity: number
          reference?: string | null
          site_id?: string | null
          unit_cost?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          material_id?: string
          movement_date?: string
          movement_type?: string
          notes?: string | null
          project_id?: string | null
          quantity?: number
          reference?: string | null
          site_id?: string | null
          unit_cost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_movements_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          amount: number | null
          description: string
          id: string
          invoice_id: string
          position: number | null
          quantity: number | null
          unit_price: number | null
          vat_rate: number | null
        }
        Insert: {
          amount?: number | null
          description: string
          id?: string
          invoice_id: string
          position?: number | null
          quantity?: number | null
          unit_price?: number | null
          vat_rate?: number | null
        }
        Update: {
          amount?: number | null
          description?: string
          id?: string
          invoice_id?: string
          position?: number | null
          quantity?: number | null
          unit_price?: number | null
          vat_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          client_id: string
          created_at: string | null
          created_by: string | null
          due_date: string | null
          id: string
          invoice_number: string
          invoice_type: Database["public"]["Enums"]["invoice_type"] | null
          issue_date: string
          notes: string | null
          paid_amount: number | null
          project_id: string | null
          status: Database["public"]["Enums"]["invoice_status"] | null
          subtotal: number | null
          terms: string | null
          total_amount: number | null
          updated_at: string | null
          vat_amount: number | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          created_by?: string | null
          due_date?: string | null
          id?: string
          invoice_number: string
          invoice_type?: Database["public"]["Enums"]["invoice_type"] | null
          issue_date?: string
          notes?: string | null
          paid_amount?: number | null
          project_id?: string | null
          status?: Database["public"]["Enums"]["invoice_status"] | null
          subtotal?: number | null
          terms?: string | null
          total_amount?: number | null
          updated_at?: string | null
          vat_amount?: number | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          created_by?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string
          invoice_type?: Database["public"]["Enums"]["invoice_type"] | null
          issue_date?: string
          notes?: string | null
          paid_amount?: number | null
          project_id?: string | null
          status?: Database["public"]["Enums"]["invoice_status"] | null
          subtotal?: number | null
          terms?: string | null
          total_amount?: number | null
          updated_at?: string | null
          vat_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      materials: {
        Row: {
          category: string | null
          code: string | null
          created_at: string | null
          id: string
          name: string
          reorder_level: number | null
          unit: string | null
          unit_cost: number | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          code?: string | null
          created_at?: string | null
          id?: string
          name: string
          reorder_level?: number | null
          unit?: string | null
          unit_cost?: number | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          code?: string | null
          created_at?: string | null
          id?: string
          name?: string
          reorder_level?: number | null
          unit?: string | null
          unit_cost?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      payments_received: {
        Row: {
          amount: number
          client_id: string | null
          created_at: string | null
          created_by: string | null
          id: string
          invoice_id: string | null
          method: Database["public"]["Enums"]["payment_method"] | null
          notes: string | null
          payment_date: string
          reference_no: string | null
        }
        Insert: {
          amount?: number
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          invoice_id?: string | null
          method?: Database["public"]["Enums"]["payment_method"] | null
          notes?: string | null
          payment_date?: string
          reference_no?: string | null
        }
        Update: {
          amount?: number
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          invoice_id?: string | null
          method?: Database["public"]["Enums"]["payment_method"] | null
          notes?: string | null
          payment_date?: string
          reference_no?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_received_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_received_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll: {
        Row: {
          advances: number | null
          allowances: number | null
          basic_salary: number | null
          created_at: string | null
          deductions: number | null
          employee_id: string
          id: string
          net_salary: number | null
          overtime_amount: number | null
          paid_date: string | null
          period_month: number
          period_year: number
          project_allocation: Json | null
          status: string | null
        }
        Insert: {
          advances?: number | null
          allowances?: number | null
          basic_salary?: number | null
          created_at?: string | null
          deductions?: number | null
          employee_id: string
          id?: string
          net_salary?: number | null
          overtime_amount?: number | null
          paid_date?: string | null
          period_month: number
          period_year: number
          project_allocation?: Json | null
          status?: string | null
        }
        Update: {
          advances?: number | null
          allowances?: number | null
          basic_salary?: number | null
          created_at?: string | null
          deductions?: number | null
          employee_id?: string
          id?: string
          net_salary?: number | null
          overtime_amount?: number | null
          paid_date?: string | null
          period_month?: number
          period_year?: number
          project_allocation?: Json | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payroll_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      po_items: {
        Row: {
          amount: number | null
          description: string | null
          id: string
          material_id: string | null
          po_id: string
          quantity: number | null
          received_quantity: number | null
          unit_price: number | null
        }
        Insert: {
          amount?: number | null
          description?: string | null
          id?: string
          material_id?: string | null
          po_id: string
          quantity?: number | null
          received_quantity?: number | null
          unit_price?: number | null
        }
        Update: {
          amount?: number | null
          description?: string | null
          id?: string
          material_id?: string | null
          po_id?: string
          quantity?: number | null
          received_quantity?: number | null
          unit_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "po_items_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "po_items_po_id_fkey"
            columns: ["po_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          designation: string | null
          email: string | null
          full_name: string | null
          id: string
          language: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          designation?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          language?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          designation?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          language?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          budget: number | null
          client_id: string | null
          code: string
          contract_value: number | null
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string | null
          id: string
          name: string
          project_manager_id: string | null
          site_location: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"] | null
          updated_at: string | null
        }
        Insert: {
          budget?: number | null
          client_id?: string | null
          code: string
          contract_value?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          project_manager_id?: string | null
          site_location?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          updated_at?: string | null
        }
        Update: {
          budget?: number | null
          client_id?: string | null
          code?: string
          contract_value?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          project_manager_id?: string | null
          site_location?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          created_at: string | null
          expected_date: string | null
          id: string
          notes: string | null
          order_date: string
          po_number: string
          project_id: string | null
          status: string | null
          total_amount: number | null
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          created_at?: string | null
          expected_date?: string | null
          id?: string
          notes?: string | null
          order_date?: string
          po_number: string
          project_id?: string | null
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          created_at?: string | null
          expected_date?: string | null
          id?: string
          notes?: string | null
          order_date?: string
          po_number?: string
          project_id?: string | null
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      sites: {
        Row: {
          created_at: string | null
          id: string
          location: string | null
          name: string
          project_id: string
          supervisor: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          location?: string | null
          name: string
          project_id: string
          supervisor?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          location?: string | null
          name?: string
          project_id?: string
          supervisor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sites_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vendor_bills: {
        Row: {
          amount: number | null
          attachment_url: string | null
          bill_date: string
          bill_number: string | null
          created_at: string | null
          due_date: string | null
          id: string
          notes: string | null
          paid_amount: number | null
          project_id: string | null
          status: string | null
          total_amount: number | null
          updated_at: string | null
          vat_amount: number | null
          vendor_id: string
        }
        Insert: {
          amount?: number | null
          attachment_url?: string | null
          bill_date?: string
          bill_number?: string | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          paid_amount?: number | null
          project_id?: string | null
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
          vat_amount?: number | null
          vendor_id: string
        }
        Update: {
          amount?: number | null
          attachment_url?: string | null
          bill_date?: string
          bill_number?: string | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          paid_amount?: number | null
          project_id?: string | null
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
          vat_amount?: number | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_bills_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_bills_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          address: string | null
          bank_account: string | null
          bank_name: string | null
          contact_person: string | null
          created_at: string | null
          email: string | null
          iban: string | null
          id: string
          mobile: string | null
          name: string
          notes: string | null
          updated_at: string | null
          vat_number: string | null
        }
        Insert: {
          address?: string | null
          bank_account?: string | null
          bank_name?: string | null
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          iban?: string | null
          id?: string
          mobile?: string | null
          name: string
          notes?: string | null
          updated_at?: string | null
          vat_number?: string | null
        }
        Update: {
          address?: string | null
          bank_account?: string | null
          bank_name?: string | null
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          iban?: string | null
          id?: string
          mobile?: string | null
          name?: string
          notes?: string | null
          updated_at?: string | null
          vat_number?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "finance_manager"
        | "accountant"
        | "project_manager"
        | "site_engineer"
        | "store_keeper"
        | "hr"
        | "viewer"
      approval_status: "submitted" | "approved" | "rejected"
      expense_category:
        | "labor"
        | "materials"
        | "transport"
        | "machinery"
        | "accommodation"
        | "office_overhead"
        | "miscellaneous"
      invoice_status:
        | "draft"
        | "sent"
        | "partially_paid"
        | "paid"
        | "overdue"
        | "cancelled"
      invoice_type: "proforma" | "tax" | "progress" | "final"
      payment_method: "cash" | "bank_transfer" | "cheque" | "card" | "other"
      project_status:
        | "tender"
        | "approved"
        | "in_progress"
        | "on_hold"
        | "completed"
        | "closed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "admin",
        "finance_manager",
        "accountant",
        "project_manager",
        "site_engineer",
        "store_keeper",
        "hr",
        "viewer",
      ],
      approval_status: ["submitted", "approved", "rejected"],
      expense_category: [
        "labor",
        "materials",
        "transport",
        "machinery",
        "accommodation",
        "office_overhead",
        "miscellaneous",
      ],
      invoice_status: [
        "draft",
        "sent",
        "partially_paid",
        "paid",
        "overdue",
        "cancelled",
      ],
      invoice_type: ["proforma", "tax", "progress", "final"],
      payment_method: ["cash", "bank_transfer", "cheque", "card", "other"],
      project_status: [
        "tender",
        "approved",
        "in_progress",
        "on_hold",
        "completed",
        "closed",
      ],
    },
  },
} as const
