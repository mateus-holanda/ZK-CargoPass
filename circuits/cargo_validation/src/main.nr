// Circuit to verify if the sum of individual values of all items is equal to the total amount declared
fn main(unity_value: u64, quantity: u64, total_declared_value: u64) {
    // Calculate the sum of item values
    let sum: u64 = unity_value * quantity;

    // Check if the sum is equal to the total declared
    // Allowing a tiny error margin of 1 cent due to truncation
    let difference: u64 = if sum > total_declared_value { sum - total_declared_value } else { total_declared_value - sum };

    assert(difference <= 1);
}

#[test]
fn test_main() {
    // Test with consistent amount declared for the total values of the items
    let unity_value = 500;
    let quantity = 200;
    let total_declared_value = 100000;
    
    main(unity_value, quantity, total_declared_value);
}

#[test(should_fail)]
fn test_main_smaller_value_declared() {
    // Test with amount declared smaller than total value of the items
    let unity_value = 500;
    let quantity = 200;
    let total_declared_value = 80000;
    
    main(unity_value, quantity, total_declared_value);
}

#[test]
fn test_main_diff_1_cent() {
    // Test with amount declared within the range of 1 cent for total value of the items
    let unity_value = 500;
    let quantity = 200;
    let total_declared_value = 100001;

    main(unity_value, quantity, total_declared_value);
}

#[test(should_fail)]
fn test_main_diff_2_cent() {
    // Test with amount declared outside of the range of 1 cent for total value of the items
    let unity_value = 500;
    let quantity = 200;
    let total_declared_value = 100002;

    main(unity_value, quantity, total_declared_value);
}