
/// <reference path="../pb_data/types.d.ts" />
onMailerSend((e) => {
    if (e.app.settings().smtp.enabled) {
        return e.next()
    }

    const apiKey = $os.getenv("RESEND_API_KEY");
    const senderAddress = $os.getenv("RESEND_FROM_ADDRESS") || "Valookie <hola@valookie.com>";

    const payload = {
        "from": senderAddress,
        "to": [e.message.to[0].address],
        "subject": e.message.subject,
    }

    if (e.message.html) {
        payload.html = e.message.html;
    } else {
        payload.text = e.message.text;
    }

    const response = $http.send({
        url: "https://api.resend.com/emails",
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    if (response.statusCode !== 200) {
        $app.logger().error("Failed to send email via Resend", "error", response.json);

        throw new ApiError(500, response.json?.message || 'Failed to send email');
    }
})
