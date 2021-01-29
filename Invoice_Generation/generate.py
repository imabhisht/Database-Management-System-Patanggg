import invoice_generator as call
invoice = call.InvoiceGenerator(
    sender="Patnaggg Digital Solution Company Name",
    to="Dinesh Patel, 65 - Living in Vadodara, Probably in Manjalpur , Vadodara Gujarat - 390011 ",
    logo="https://www.brandingmag.com/wp-content/uploads/2012/08/new-microsoft-logo-2.png",
    number=4234412,
    notes="Thanks for using Patanggg App!!",
    shipping=50
)

invoice.add_item(
    name="Delux 23 inch Kite [Set of 20] ",
    quantity=3,
    unit_cost=80,
)
invoice.add_item(
    name="Hot Deal - Delux 23 inch Kite [Set of 20] ",
    quantity=15,
    unit_cost=70,
)

invoice.toggle_subtotal(shipping=True)

invoice.download("invoice.pdf")
