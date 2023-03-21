import { expect, test } from 'vitest';
// import { render } from '@testing-library/react';
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';  
import useBreedList from '../useBreedList';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity,
            cacheTime: Infinity,
            retry: false
        }
    }
})

// old way-- simulate react component to utilize hook

// function getBreedList(animal) {
//     let list;

//     function TestComponent () {
//         list = useBreedList(animal);
//         null;
//     }

//     render(
//         <QueryClientProvider client={queryClient}>
//             <TestComponent />
//         </QueryClientProvider>
//     );

//     return list;
// }

test("gives an empty list with no animal provied", async () => {

    const { result } = renderHook(() => useBreedList(""), {
        wrapper: ({ children }) => (
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        ),
    });
    const [breedList, status] = result.current;

    expect(breedList).toHaveLength(0);
    expect(status).toBe("loading");
    //old way

    // const [breedList, status] = getBreedList();
    // expect(breedList).toHaveLength(0);
    // expect(status).toBe("loading");
});

test("gives back breeds when given an animal", async () => {
    const breeds = [
        "Havanese",
        "Bichon Frise",
        "Poodle",
        "Maltese",
        "Golden Retreiver",
        "Labrador",
        "Husky",
    ];
    fetch.mockResponseOnce(
        JSON.stringify({
            animal: "dog",
            breeds,
        })
    );
    const { result } = renderHook(() => useBreedList("dog"), {
        wrapper: ({ children }) => (
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        ),
    });

    await waitFor(() => expect(result.current[1]).toBe("success"));

    const [breedList] = result.current;
    expect(breedList).toEqual(breeds);
});