// Circuit to verify if the amount paid in taxes is the right percentage of the total amount declared
fn main(total_declared_value: Field, amount_paid: Field, tax_percentage: pub Field) {
    // Calculate the minimum amount of taxes to be paid 
    // To avoid divisions the amount paid is multiplied by 100
    let amount_to_pay: Field = total_declared_value * tax_percentage;

    assert(amount_paid * 100 >= amount_to_pay);
}

#[test]
fn test_main_exact_min_percentage() {
    // Test with the exact percentage paid in taxes (15%)
    let total_declared_value = 1000000; // Total amount declared: $10,000.00
    let amount_paid = 150000;           // Amount paid in taxes:  $1,500.00
    let tax_percentage = 15;            // Taxes: 15%

    main(total_declared_value, amount_paid, tax_percentage);
}

#[test]
fn test_main_above_min_percentage() {
    // Test with a greater percentage paid in taxes (20%)
    let total_declared_value = 1000000; // Total amount declared: $10,000.00
    let amount_paid = 200000;           // Amount paid in taxes:  $2,000.00
    let tax_percentage = 15;            // Taxes: 15%

    main(total_declared_value, amount_paid, tax_percentage);
}

#[test(should_fail)]
fn test_main_below_min_percentage() {
    // Test with a lower percentage paid in taxes (10%)
    let total_declared_value = 1000000; // Total amount declared: $10,000.00
    let amount_paid = 100000;           // Amount paid in taxes:  $1,000.00
    let tax_percentage = 15;            // Taxes: 15%

    main(total_declared_value, amount_paid, tax_percentage);
}