export function createAction<TInput, TOutput>(
    action: (input: TInput) => Promise<TOutput>
){
    return async (
        input: TInput,
        callbacks?: {
            onRequest: () => void;
            onSuccess?: (ctx: {data: TOutput}) => void;
            onError?: (ctx: {error: Error}) => void;
        }
    ) => {
        try {
            callbacks?.onRequest?.();

            const data = await action(input)

            callbacks?.onSuccess?.({data})
            return data;
        } catch (err) {
            const error = err instanceof Error ? err : new Error("unknown error");

            callbacks?.onError?.({error});

            throw error;
        }
    }
}