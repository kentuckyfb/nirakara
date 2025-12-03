import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, getProduct, getConfig, createProduct, updateProduct, deleteProduct } from '@/lib/api';

export const useProducts = () => {
    return useQuery({
        queryKey: ['products'],
        queryFn: getProducts,
    });
};

export const useProduct = (slug: string) => {
    return useQuery({
        queryKey: ['product', slug],
        queryFn: () => getProduct(slug),
        enabled: !!slug,
    });
};

export const useConfig = () => {
    return useQuery({
        queryKey: ['config'],
        queryFn: getConfig,
    });
};

export const useAdminProducts = () => {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: ({ product, token }: { product: FormData; token: string }) => createProduct(product, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, product, token }: { id: string; product: FormData; token: string }) => updateProduct(id, product, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: ({ id, token }: { id: string; token: string }) => deleteProduct(id, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });

    return {
        createProduct: createMutation.mutateAsync,
        updateProduct: updateMutation.mutateAsync,
        deleteProduct: deleteMutation.mutateAsync,
    };
};
