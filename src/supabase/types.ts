export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    email: string
                    display_name?: string
                    first_name?: string
                    last_name?: string
                    position?: string
                    organization?: string
                    address?: string
                    photo_url?: string
                    created_at: number
                    updated_at: number
                }
                Insert: {
                    id: string
                    email: string
                    display_name?: string
                    first_name?: string
                    last_name?: string
                    position?: string
                    organization?: string
                    address?: string
                    photo_url?: string
                    created_at?: number
                    updated_at?: number
                }
                Update: {
                    id?: string
                    email?: string
                    display_name?: string
                    first_name?: string
                    last_name?: string
                    position?: string
                    organization?: string
                    address?: string
                    photo_url?: string
                    updated_at?: number
                }
            },
            orders: {
                Row: {
                    id: string
                    order_number: number
                    client_name: string
                    client_phone: string
                    client_email?: string
                    device_type: string
                    device_model: string
                    serial_number?: string
                    issue_description: string
                    prepayment: number
                    master_comment?: string
                    status: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    order_number: number
                    client_name: string
                    client_phone: string
                    client_email?: string
                    device_type: string
                    device_model: string
                    serial_number?: string
                    issue_description: string
                    prepayment?: number
                    master_comment?: string
                    status?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    order_number?: number
                    client_name?: string
                    client_phone?: string
                    client_email?: string
                    device_type?: string
                    device_model?: string
                    serial_number?: string
                    issue_description?: string
                    prepayment?: number
                    master_comment?: string
                    status?: string
                    updated_at?: string
                }
            },
            services: {
                Row: {
                    id: string
                    name: string
                    type: string
                    price: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    type: string
                    price: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    type?: string
                    price?: number
                    updated_at?: string
                }
            },
            order_services: {
                Row: {
                    id: string
                    order_id: string
                    service_id?: string
                    name: string
                    price: number
                    quantity: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    order_id: string
                    service_id?: string
                    name: string
                    price: number
                    quantity?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    order_id?: string
                    service_id?: string
                    name?: string
                    price?: number
                    quantity?: number
                }
            }
            // Здесь можно добавить другие таблицы
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
} 