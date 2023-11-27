export const sendHtml = (email: string) => {
  return (
    `<div style="background-color:aliceblue;height:200px;display:flex;justify-content: center;
align-content: center;align-items: center;border: 4px solid black;border-radius: 25px;" >
<p style=color:black;display:inline-block;font-size:20px;>
Поздравляю с успешной регистрации.Исрользуйте ${email} для входа.
  </p>
</div>`
  );
};