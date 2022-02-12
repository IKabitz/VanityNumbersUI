import axios from 'axios';
import React, { useState, useEffect } from 'react'

// Bad, don't do this, we should reference the gateway endpoint dynamically
const apiGWEndpoint = "https://jwu83yp5xh.execute-api.us-east-1.amazonaws.com/prod";

function VanityNumberSearch() {

    // Search results from the dynamodb table scan
    const [searchResults, setSearchResults] = useState([])

    useEffect(() => {
        axios.get(apiGWEndpoint)
            .then(res => {
                const Items = res.data.Items;
                if (Items) {
                    var results = [];
                    for (let item of Items) {
                        results.push({
                            customer: item.CustomerNumber,
                            numbers: item.BestNumbers
                        })
                    }
                    setSearchResults(results);
                }
            })
    }, [])

    if (searchResults.length > 0) {
        return (
            <div className='Search-Results'>
                <p>The last 5 numbers to call the vanity number project <br/> and their associated vanity numbers </p>
                <table>
                    <tbody>
                        {searchResults.map((result, index) => <tr key={index}>
                            <td key={result.customer}>
                                {result.customer}
                            </td>
                            <td key={result.customer + "numbers"}>
                                {result.numbers}
                            </td>
                        </tr> )}
                    </tbody>
                </table>
            </div>
        )
    }
    else {
        return (
            <div>
                <p>There are no search results!</p>
            </div>
        )
    }

}

export default VanityNumberSearch;